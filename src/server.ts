import type { TerminusOptions } from "@godaddy/terminus";
import { createTerminus } from "@godaddy/terminus";
import * as http from "http";
import createApp from "src/app";
import { getEnvConfig } from "src/config";
import { CheckFirebase, InitializeFirebase } from "src/firebase/setup";
import logger from "src/lib/logger";
import {
  createWebSocketController,
  getWebSocketController,
} from "src/websocket/controllers";
import { startWebSocketHandlers } from "src/websocket/handlers";

export let SERVER_ONLINE = true;

export async function createServer(): Promise<http.Server> {
  const server = http.createServer(await createApp());

  await InitializeFirebase();
  createWebSocketController(server);
  startWebSocketHandlers();

  const serverShutdownTimeout = getEnvConfig("SERVER_SHUTDOWN_TIMEOUT");

  const terminusOptions: TerminusOptions = {
    timeout:
      serverShutdownTimeout >= 0 && serverShutdownTimeout < Infinity
        ? serverShutdownTimeout
        : 1000,
    signals: ["SIGINT", "SIGTERM", "SIGHUP"],
    beforeShutdown,
    onSignal,
    onShutdown,
  };

  createTerminus(server, terminusOptions);

  return server;

  async function beforeShutdown() {
    logger.info("Shutting down...");

    SERVER_ONLINE = false;
  }

  async function onSignal() {
    getWebSocketController()?.terminate();

    logger.info("Terminated websocket connections");
  }

  async function onShutdown() {
    logger.info("BigServer is shutting down, OK. Bye bye!");
  }
}

export async function startServer(): Promise<void> {
  // const server = await createServer();
  const app = await createApp();
  const host = getEnvConfig("HOST");
  const port = getEnvConfig("PORT");

  console.log(typeof port, port);

  // await CheckFirebase();

  app
    .listen({ port, host }, () => {
      logger.info(`BigServer started at http://${host}:${port}`);
    })
    .once("error", (err: any) => {
      if (err?.code === "EADDRINUSE") {
        logger.error(`Port ${port} is already in use`);
        process.exit(1);
      } else {
        throw err;
      }
    });
}
