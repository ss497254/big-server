import { getAccountabilityForToken } from "../utils/get-accountability-for-token";
import { WebSocketError } from "./errors";
import type { WebSocketResponse } from "./messages";

export async function authenticateConnection(access_token: string) {
  try {
    if (!access_token) throw new Error("No access_token provided");

    return await getAccountabilityForToken(access_token);
  } catch (error: any) {
    throw new WebSocketError("auth", "AUTH_FAILED", error.message);
  }
}

export function authenticationSuccess(username?: string | number): string {
  const message: WebSocketResponse = {
    type: "auth",
    status: "ok",
  };

  if (username !== undefined) {
    message.username = username;
  }

  return JSON.stringify(message);
}
