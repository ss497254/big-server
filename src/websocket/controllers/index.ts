import type { Server as httpServer } from "http";
import { getEnvConfig } from "src/config";
import { ServiceUnavailableError } from "src/errors";
import { WebSocketController } from "./websocket";

let websocketController: WebSocketController | undefined;

export function createWebSocketController(server: httpServer) {
  if (getEnvConfig("WEBSOCKETS_ENABLED")) {
    websocketController = new WebSocketController(server);
  }
}

export function getWebSocketController() {
  if (!getEnvConfig("WEBSOCKETS_ENABLED")) {
    throw new ServiceUnavailableError({
      service: "ws",
      reason: "WebSocket server is disabled",
    });
  }

  if (!websocketController) {
    throw new ServiceUnavailableError({
      service: "ws",
      reason: "WebSocket server is not initialized",
    });
  }

  return websocketController;
}

export * from "./websocket";
