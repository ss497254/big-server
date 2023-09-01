import type { IncomingMessage, Server as httpServer } from "http";
import { getEnv, getEnvConfig } from "src/config";
import logger from "src/lib/logger";
import type internal from "stream";
import { parse } from "url";
import WebSocket, { WebSocketServer } from "ws";
import { authenticateConnection, authenticationSuccess } from "../authenticate";
import { WebSocketError, handleWebSocketError } from "../errors";
import { WebSocketAuthMessage, WebSocketMessage } from "../messages";
import type {
  AuthenticationState,
  UpgradeContext,
  WebSocketClient,
} from "../types";
import { getMessageType } from "../utils/message";
import { waitForAnyMessage } from "../utils/wait-for-message";

const env = getEnv();

export default abstract class SocketController {
  server: WebSocket.Server;
  clients: Map<string, WebSocketClient>;

  endpoint: string;
  maxConnections: number;

  constructor(httpServer: httpServer) {
    this.server = new WebSocketServer({ noServer: true });
    this.clients = new Map();

    const { endpoint, maxConnections } = this.getEnvironmentConfig();
    this.endpoint = endpoint;
    this.maxConnections = maxConnections;

    httpServer.on("upgrade", this.handleUpgrade.bind(this));
    httpServer.on("listening", () => {
      logger.info(
        `WebSocket Server started at ws://${getEnvConfig(
          "HOST"
        )}:${getEnvConfig("PORT")}${endpoint}`
      );
    });
  }

  protected getEnvironmentConfig(): {
    endpoint: string;
    maxConnections: number;
  } {
    const endpoint = env["WEBSOCKETS_ENDPOINT"].value!;
    const maxConnections = env["WEBSOCKETS_CONN_LIMIT"].value!;

    return {
      endpoint,
      maxConnections,
    };
  }

  protected async handleUpgrade(
    request: IncomingMessage,
    socket: internal.Duplex,
    head: Buffer
  ) {
    const { pathname } = parse(request.url!, true);
    if (pathname !== this.endpoint) return;

    if (this.clients.size >= this.maxConnections) {
      logger.debug("WebSocket upgrade denied - max connections reached");
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }

    await this.handleHandshakeUpgrade({ request, socket, head });
  }

  protected async handleHandshakeUpgrade({
    request,
    socket,
    head,
  }: UpgradeContext) {
    this.server.handleUpgrade(request, socket, head, async (ws) => {
      try {
        const payload = await waitForAnyMessage(ws, 1000 * 60);
        if (getMessageType(payload) !== "auth") throw new Error();

        const state = await authenticateConnection(
          WebSocketAuthMessage.parse(payload)
        );

        ws.send(authenticationSuccess(payload["uid"]));
        this.server.emit("connection", ws, state);
      } catch {
        logger.debug("WebSocket authentication handshake failed");
        const error = new WebSocketError(
          "auth",
          "AUTH_FAILED",
          "Authentication handshake failed."
        );

        handleWebSocketError(ws, error, "auth");
        ws.close();
      }
    });
  }

  createClient(ws: WebSocket, { accountability }: AuthenticationState) {
    const client = ws as WebSocketClient;

    ws.on("auth", async (data: WebSocket.RawData) => {
      let message: WebSocketMessage;

      try {
        message = this.parseMessage(data.toString());
      } catch (err: any) {
        handleWebSocketError(client, err, "server");
        return;
      }

      if (getMessageType(message) === "auth") {
        try {
          await this.handleAuthRequest(
            client,
            WebSocketAuthMessage.parse(message)
          );
        } catch {
          // ignore errors
        }

        return;
      }

      // this log cannot be higher in the function or it will leak credentials
      logger.info(`WebSocket#${client.username} - ${JSON.stringify(message)}`);
      ws.emit("parsed-message", message);
    });

    ws.on("error", () => {
      logger.debug(`WebSocket#${client.username} connection errored`);

      this.clients.delete(client.username);
    });

    ws.on("close", () => {
      logger.debug(`WebSocket#${client.username} connection closed`);

      this.clients.delete(client.username);
    });

    logger.debug(`WebSocket#${client.username} connected`);

    if (accountability) {
      logger.info(
        `WebSocket#${client.username} authenticated as ${JSON.stringify(
          accountability
        )}`
      );
    }

    this.clients.set(client.username, client);
    return client;
  }

  protected parseMessage(data: string): WebSocketMessage {
    let message: WebSocketMessage;

    try {
      message = WebSocketMessage.parse(JSON.parse(data));
    } catch (err: any) {
      throw new WebSocketError(
        "server",
        "INVALID_PAYLOAD",
        "Unable to parse the incoming message."
      );
    }

    return message;
  }

  protected async handleAuthRequest(
    client: WebSocketClient,
    message: WebSocketAuthMessage
  ) {
    try {
      const { accountability } = await authenticateConnection(message);

      client.accountability = accountability;
      client.username = accountability.username;
      client.send(authenticationSuccess(message.uid));

      logger.info(
        `WebSocket#${client.username} authenticated as ${JSON.stringify(
          client.accountability
        )}`
      );
    } catch (error) {
      logger.info(`WebSocket#${client.username} failed authentication`);

      client.accountability = null;

      const _error =
        error instanceof WebSocketError
          ? error
          : new WebSocketError(
              "auth",
              "AUTH_FAILED",
              "Authentication failed.",
              message.uid
            );

      handleWebSocketError(client, _error, "auth");
    }
  }

  terminate() {
    this.server.clients.forEach((ws) => {
      ws.terminate();
    });
  }
}
