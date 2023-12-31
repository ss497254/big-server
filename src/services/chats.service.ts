import { ChannelsTable } from "src/constants";
import { firestore } from "src/firebase";
import {
  addItemWithId,
  addOrUpdateItem,
  getCollectionData,
  updateItem,
} from "src/firebase/database";
import { FieldValue } from "firebase-admin/firestore";
import { Accountability, IMessage } from "src/types";
import { WebSocketClient } from "src/websocket/types";
import logger from "src/lib/logger";
import { addFile } from "src/firebase/storage";
import dataUriToBuffer from "src/utils/datauri-to-buffer";

const ActiveChannels = new Map<string, Set<WebSocketClient>>();
const UserInChannel = new Map<string, string[]>();

const sendMessageInChannel = (channel: string, message: IMessage) =>
  ActiveChannels.has(channel) &&
  queueMicrotask(() => broadcastMessageToClients(channel, message));

const broadcastMessageToClients = (channel: string, message: IMessage) => {
  ActiveChannels.get(channel)!.forEach((client) => {
    client.send(JSON.stringify({ type: channel, message }));
  });
};

export const createChannel = async (channel: string, data: any) => {
  const result = await firestore
    .collection(ChannelsTable)
    .doc(channel)
    .create(data);

  return result;
};

export async function addUserToChannel(channel: string, users: string[]) {
  return await firestore
    .collection(ChannelsTable)
    .doc(channel)
    .update({ users: FieldValue.arrayUnion(users) });
}

export async function deleteChannel(channel: string) {
  const result = await firestore
    .collection(ChannelsTable)
    .doc(channel)
    .delete();

  if (ActiveChannels.get(channel)) {
    [...ActiveChannels.get(channel)!.values()].forEach((client) =>
      leaveChannel(channel, client)
    );
  }

  return result;
}

export const getChannels = async (accountability: Accountability) => {
  const channelCollection = firestore.collection(ChannelsTable);
  const data = await (accountability.admin
    ? channelCollection
    : channelCollection.where(
        "users",
        "array-contains",
        accountability.username
      )
  ).get();

  return data.docs.map((x) => ({
    name: x.id,
    ...x.data(),
    lastUpdate: x.updateTime.toMillis(),
  }));
};

export const getUsersOfChannel = (channel: string) => {
  if (!ActiveChannels.has(channel)) return [];

  return [...ActiveChannels.get(channel)!.values()].map((x) => ({
    username: x.username,
    connectTime: x.connectTime,
  }));
};

export const sendMessage = async (
  channel: string,
  username: string,
  content: string,
  image?: string
) => {
  const timestamp = new Date().getTime();
  const message = {
    username,
    content,
    timestamp,
  } as IMessage;
  if (image) {
    message.image = await addFile(
      `${channel}/${username}-${timestamp}`,
      dataUriToBuffer(image),
      "image/jpeg"
    );
  }

  await addItemWithId(channel, timestamp.toString(), message);
  updateItem(ChannelsTable, channel, {
    messages: FieldValue.increment(1),
  }).catch(logger.warn);

  sendMessageInChannel(channel, message);

  return message;
};

export const editMessage = async (
  channel: string,
  username: string,
  timestamp: string | number,
  content?: string,
  image?: string
) => {
  const message = {
    username,
    timestamp,
    edited: true,
  } as IMessage;

  if (content) message.content = content;

  if (image)
    message.image = await addFile(
      `${channel}/${username}-${timestamp}`,
      dataUriToBuffer(image),
      "image/jpeg"
    );

  await addOrUpdateItem(channel, timestamp.toString(), message);

  sendMessageInChannel(channel, message);

  return message;
};

export const getMessages = async (
  channel: string,
  cursor: string,
  limit = 15
) => {
  const result = await getCollectionData(channel)
    .orderBy("timestamp", "desc")
    .startAfter(parseInt(cursor))
    .limit(limit)
    .get();

  return result.docs.map((x) => x.data());
};

export const joinChannel = (channelName: string, client: WebSocketClient) => {
  if (ActiveChannels.has(channelName)) {
    ActiveChannels.get(channelName)!.add(client);
  } else {
    ActiveChannels.set(channelName, new Set([client]));
  }
};

export const leaveChannel = (channelName: string, client: WebSocketClient) => {
  const channel = ActiveChannels.get(channelName);

  if (!channel) {
    return logger.warn(
      `channel "${channelName}" doesn't exists to leave for user ${client.username}`
    );
  }

  channel.delete(client);

  if (channel.size == 0) {
    ActiveChannels.delete(channelName);
  }
  return;
};

export const userJoin = async (client: WebSocketClient) => {
  logger.info("user join", client.username, client.connectTime);

  try {
    const channels = (await getChannels(client.accountability)).map(
      (x) => x.name
    );

    channels.forEach((channel) => joinChannel(channel, client));
    UserInChannel.set(client.username, channels);
  } catch (e) {
    logger.warn(e);
    UserInChannel.set(client.username, []);
  }
};

export const userLeft = (client: WebSocketClient) => {
  logger.info("user left", client.username, client.connectTime);

  if (UserInChannel.get(client.username))
    UserInChannel.get(client.username)!.forEach((channel) =>
      leaveChannel(channel, client)
    );
  else
    logger.warn(
      "user is not present in UserInChannel (this should not happen)"
    );
};
