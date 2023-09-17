import type { Accountability } from "src/types";
import type { IncomingMessage } from "http";
import type internal from "stream";
import type { WebSocket } from "ws";

export type AuthenticationState = {
  accountability: Accountability;
};

export type WebSocketClient = WebSocket &
  AuthenticationState & {
    username: string;
    connectTime: string;
  };

export type UpgradeRequest = IncomingMessage & AuthenticationState;

export type UpgradeContext = {
  request: IncomingMessage;
  socket: internal.Duplex;
  head: Buffer;
};
