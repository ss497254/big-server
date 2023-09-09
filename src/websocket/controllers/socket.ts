import type { IncomingMessage, Server as httpServer } from "http";
import { getEnv, getEnvConfig } from "src/config";
import logger from "src/lib/logger";
import type internal from "stream";
import { parse } from "url";
import WebSocket, { WebSocketServer } from "ws";
import { authenticateConnection, authenticationSuccess } from "../authenticate";
import { WebSocketError, handleWebSocketError } from "../errors";
import { WebSocketMessage } from "../messages";
import type {
  AuthenticationState,
  UpgradeContext,
  WebSocketClient,
} from "../types";

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
        const access_token = parse(request.url!, true).query?.[
          "access_token"
        ] as string;

        const accountability = await authenticateConnection(access_token);

        this.server.emit("connection", ws, { accountability });
      } catch {
        logger.debug("WebSocket authentication handshake failed");

        const error = new WebSocketError(
          "auth",
          "AUTH_FAILED",
          "Authentication handshake failed."
        );

        handleWebSocketError(ws, error, "auth");
        ws.close(3535, error.toMessage());
      }
    });
  }

  createClient(ws: WebSocket, { accountability }: AuthenticationState) {
    const client = ws as WebSocketClient;

    client.accountability = accountability;
    client.username = accountability!.username;
    client.send(authenticationSuccess(client.username));

    ws.on("error", () => {
      this.clients.delete(client.username);
    });

    ws.on("close", () => {
      this.clients.delete(client.username);
    });

    logger.info(
      `WebSocket#${client.username} authenticated as ${JSON.stringify(
        accountability
      )}`
    );
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

  terminate() {
    this.server.clients.forEach((ws) => {
      ws.terminate();
    });
  }
}
