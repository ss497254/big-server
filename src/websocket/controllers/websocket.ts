import type { Server as httpServer } from "http";
import logger from "src/lib/logger";
import type WebSocket from "ws";
import { handleWebSocketError } from "../errors";
import { WebSocketMessage } from "../messages";
import type { AuthenticationState, WebSocketClient } from "../types";
import SocketController from "./socket";

export class WebSocketController extends SocketController {
  constructor(httpServer: httpServer) {
    super(httpServer);

    this.server.on("connection", (ws: WebSocket, auth: AuthenticationState) => {
      this.bindEvents(this.createClient(ws, auth));
    });
  }

  private bindEvents(client: WebSocketClient) {
    client.on("parsed-message", async (message: WebSocketMessage) => {
      try {
        message = WebSocketMessage.parse(message);
      } catch (error) {
        handleWebSocketError(client, error, "server");
        return;
      }
    });

    client.on("error", (event: WebSocket.Event) => {
      logger.warn(
        `websocket.close: ${client.username} ${event.type} ${event.target}`
      );
    });

    client.on("close", (event: WebSocket.CloseEvent) => {
      logger.warn(
        `websocket.close: ${client.username} ${event.code} ${event.reason}`
      );
    });
  }
}
