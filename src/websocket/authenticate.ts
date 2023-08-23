import { getAccountabilityForToken } from "../utils/get-accountability-for-token";
import { WebSocketError } from "./errors";
import type { BasicAuthMessage, WebSocketResponse } from "./messages";

export async function authenticateConnection(
  message: BasicAuthMessage & Record<string, any>
) {
  let access_token: string | undefined;

  try {
    if ("access_token" in message) {
      access_token = message.access_token;
    }

    if (!access_token) throw new Error();

    const accountability = await getAccountabilityForToken(access_token);

    return { accountability };
  } catch (error) {
    throw new WebSocketError(
      "auth",
      "AUTH_FAILED",
      "Authentication failed.",
      message["uid"]
    );
  }
}

export function authenticationSuccess(uid?: string | number): string {
  const message: WebSocketResponse = {
    type: "auth",
    status: "ok",
  };

  if (uid !== undefined) {
    message.uid = uid;
  }

  return JSON.stringify(message);
}
