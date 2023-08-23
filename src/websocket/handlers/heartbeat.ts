import {
  WebSocketController,
  getWebSocketController,
} from "../controllers/index";
import { WebSocketMessage } from "../messages";
import type { WebSocketClient } from "../types";
import { fmtMessage, getMessageType } from "../utils/message";
import { getEnvConfig } from "src/config";

const HEARTBEAT_FREQUENCY = getEnvConfig(
  "WEBSOCKETS_HEARTBEAT_PERIOD"
) as number;

export class HeartbeatHandler {
  private pulse: NodeJS.Timeout | undefined;
  private controller: WebSocketController;

  constructor(controller?: WebSocketController) {
    this.controller = controller ?? getWebSocketController();

    // emitter.onAction("websocket.message", ({ client, message }) => {
    //   try {
    //     this.onMessage(client, WebSocketMessage.parse(message));
    //   } catch {
    //     /* ignore errors */
    //   }
    // });

    // if (toBoolean(env["WEBSOCKETS_HEARTBEAT_ENABLED"]) === true) {
    //   emitter.onAction("websocket.connect", () => this.checkClients());
    //   emitter.onAction("websocket.error", () => this.checkClients());
    //   emitter.onAction("websocket.close", () => this.checkClients());
    // }
  }

  private checkClients() {
    const hasClients = this.controller.clients.size > 0;

    if (hasClients && !this.pulse) {
      this.pulse = setInterval(() => {
        this.pingClients();
      }, HEARTBEAT_FREQUENCY);
    }

    if (!hasClients && this.pulse) {
      clearInterval(this.pulse);
      this.pulse = undefined;
    }
  }

  onMessage(client: WebSocketClient, message: WebSocketMessage) {
    if (getMessageType(message) !== "ping") return;
    // send pong message back as acknowledgement
    const data = "uid" in message ? { uid: message.uid } : {};
    client.send(fmtMessage("pong", data));
  }

  pingClients() {
    const pendingClients = new Map<string, WebSocketClient>(
      this.controller.clients
    );
    const activeClients = new Map<string, WebSocketClient>();

    const timeout = setTimeout(() => {
      // close connections that haven't responded
      for (const client of pendingClients.values()) {
        client.close();
      }
    }, HEARTBEAT_FREQUENCY);

    const messageWatcher = (user: string, client: WebSocketClient) => {
      // any message means this connection is still open
      if (!activeClients.has(user)) {
        pendingClients.delete(user);
        activeClients.set(user, client);
      }

      if (pendingClients.size === 0) {
        clearTimeout(timeout);
      }
    };

    for (const client of pendingClients.values()) {
      client.send(fmtMessage("ping"));
      client.on("message", messageWatcher);
    }
  }
}
