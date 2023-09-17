import type { Server as httpServer } from "http";
import logger from "src/lib/logger";
import type WebSocket from "ws";
import type { AuthenticationState, WebSocketClient } from "../types";
import SocketController from "./socket";
import { userJoin, userLeft } from "src/services/chats.service";

export class WebSocketController extends SocketController {
  constructor(httpServer: httpServer) {
    super(httpServer);

    this.server.on("connection", (ws: WebSocket, auth: AuthenticationState) => {
      this.bindEvents(this.createClient(ws, auth));
    });
  }

  private bindEvents(client: WebSocketClient) {
    userJoin(client);

    client.on("error", (event: WebSocket.Event) => {
      userLeft(client);
      logger.warn(
        `websocket.close: ${client.username} ${event.type} ${event.target}`
      );
    });

    client.on("close", (event: WebSocket.CloseEvent) => {
      userLeft(client);
      logger.info(
        `websocket.close: ${client.username} ${event.code} ${event.reason}`
      );
    });
  }
}
