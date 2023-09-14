import type { BigServerError } from "src/errors";
import { isBigServerError } from "src/errors";
import type { WebSocket } from "ws";
import logger from "src/lib/logger";
import type { WebSocketResponse } from "./messages";
import type { WebSocketClient } from "./types";

export class WebSocketError extends Error {
  type: string;
  code: string;
  uid: string | number | undefined;
  constructor(
    type: string,
    code: string,
    message: string,
    uid?: string | number
  ) {
    super(message);
    this.type = type;
    this.code = code;
    this.uid = uid;
  }

  toJSON(): WebSocketResponse {
    const message: WebSocketResponse = {
      type: this.type,
      status: "error",
      error: {
        code: this.code,
        message: this.message,
      },
    };

    if (this.uid !== undefined) {
      message.uid = this.uid;
    }

    return message;
  }

  toMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  static fromError(error: BigServerError<unknown>, type = "unknown") {
    return new WebSocketError(type, error.code, error.message);
  }
}

export function handleWebSocketError(
  client: WebSocketClient | WebSocket,
  error: any,
  type?: string
): void {
  if (isBigServerError(error)) {
    client.send(WebSocketError.fromError(error, type).toMessage());
    return;
  }

  if (error instanceof WebSocketError) {
    client.send(error.toMessage());
    return;
  }

  // unhandled exceptions
  logger.error(
    `WebSocket unhandled exception ${error.toString()} ${JSON.stringify({
      type,
      error,
    })}`
  );
}
