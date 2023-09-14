import { ChannelsTable } from "src/constants";
import { firestore } from "src/firebase";
import {
  addItemWithId,
  getCollectionData,
  updateItem,
} from "src/firebase/database";
import { FieldValue } from "firebase-admin/firestore";
import { IMessage } from "src/types";
import { WebSocketClient } from "src/websocket/types";

const ActiveChannels = new Map<string, Set<WebSocketClient>>();

const broadcastMessageToClients = (channel: string, message: IMessage) => {
  ActiveChannels.get(channel)!.forEach((client) => {
    client.send(JSON.stringify({ type: channel, message }));
    console.log("sending message to ", client.username, "in channel", channel);
  });
};

export const createChannel = async (channel: string, data: any) => {
  const result = await firestore
    .collection(ChannelsTable)
    .doc(channel)
    .create(data);

  return result;
};

export const getChannels = async (permissions: string[]) => {
  const data = await firestore
    .collection(ChannelsTable)
    .where("access", "in", permissions)
    .get();

  return data.docs.map((x) => ({
    name: x.id,
    ...x.data(),
    lastUpdate: x.updateTime.toMillis(),
  }));
};

export const sendMessage = async (
  channel: string,
  username: string,
  content: string
) => {
  const timestamp = new Date().getTime();
  const message = {
    username,
    content,
    timestamp,
  };

  await addItemWithId(channel, timestamp.toString(), message);
  updateItem(ChannelsTable, channel, {
    messages: FieldValue.increment(1),
  });

  if (ActiveChannels.has(channel)) broadcastMessageToClients(channel, message);

  return message;
};

export const getMessages = async (channel: string, cursor: string) => {
  const result = await getCollectionData(channel)
    .orderBy("timestamp", "desc")
    .startAfter(parseInt(cursor))
    .limit(15)
    .get();

  return result.docs.map((x) => x.data());
};

export const joinChannel = (channelName: string, client: WebSocketClient) => {
  if (ActiveChannels.has(channelName)) {
    ActiveChannels.get(channelName)!.add(client);
  } else {
    ActiveChannels.set(channelName, new Set([client]));
  }

  client.channels.push(channelName);
};

export const leaveChannel = (channelName: string, client: WebSocketClient) => {
  const channel = ActiveChannels.get(channelName);

  if (!channel) throw new Error(`channel "${channelName}" doesn't exists`);

  ActiveChannels.get(channelName)!.delete(client);

  if (channel.has(client))
    throw new Error(
      `user "${client.username}" doesn't exits in channel "${channelName}"`
    );

  channel.delete(client);

  if (channel.size == 0) {
    ActiveChannels.delete(channelName);
  }
};

export const userJoin = async (client: WebSocketClient) => {
  console.log("user join");

  const { permissions } = client.accountability!;
  const channels = (await getChannels(permissions)).map((x) => x.name);

  channels.forEach((channel) => joinChannel(channel, client));
  client.channels = channels;
};

export const userLeft = (client: WebSocketClient) => {
  console.log("user left");

  client.channels.forEach((channel) => leaveChannel(channel, client));
};
