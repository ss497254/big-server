import { getEnvConfig } from "src/config";
import {
  WebSocketController,
  getWebSocketController,
} from "../controllers/index";
import { fmtMessage } from "../utils/message";

const HEARTBEAT_FREQUENCY = getEnvConfig(
  "WEBSOCKETS_HEARTBEAT_PERIOD"
) as number;

export class HeartbeatHandler {
  private pulse: NodeJS.Timeout | undefined;
  private controller: WebSocketController;

  constructor() {
    this.controller = getWebSocketController();

    this.controller.server.on("connection", this.checkClients.bind(this));
  }

  checkClients() {
    const hasClients = this.controller.server.clients.size > 0;

    if (this.pulse) {
      clearInterval(this.pulse);
      this.pulse = undefined;
    }

    if (hasClients) {
      this.pulse = setInterval(
        this.pingClients.bind(this),
        HEARTBEAT_FREQUENCY
      );
    }
  }

  pingClients() {
    const clients = this.controller.server.clients;

    for (const client of clients.values()) {
      client.send(fmtMessage("ping"));
    }

    this.checkClients();
  }
}
