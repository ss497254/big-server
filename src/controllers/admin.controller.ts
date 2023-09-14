import { Request, Response } from "express";
import { lastPingResponse } from "src/lib/keep-me-alive";
import { getWebSocketController } from "src/websocket/controllers";

export const getHealthStatus = (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      lastPingResponse,
    },
  });
};

export const getActiveClients = async (_req: Request, res: Response) => {
  const wsController = getWebSocketController();

  res.json({ clients: [...wsController.clients.keys()] });
};
