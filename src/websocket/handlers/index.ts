import { HeartbeatHandler } from "./heartbeat";

export function startWebSocketHandlers() {
  new HeartbeatHandler();
}

export * from "./heartbeat";
