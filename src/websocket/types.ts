import type { Accountability } from "src/types";
import type { IncomingMessage } from "http";
import type internal from "stream";
import type { WebSocket } from "ws";

export type AuthenticationState = {
  accountability: Accountability | null;
};

export type WebSocketClient = WebSocket &
  AuthenticationState & {
    user: string;
  };
export type UpgradeRequest = IncomingMessage & AuthenticationState;

export type UpgradeContext = {
  request: IncomingMessage;
  socket: internal.Duplex;
  head: Buffer;
};
