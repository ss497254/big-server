import { differenceInMinutes } from "date-fns";
import { Request, Response } from "express";
import { lastPingResponse } from "src/lib/keep-me-alive";
import asyncHandler from "src/utils/async-handler";

const startTime = new Date();

export const getHealthStatus = asyncHandler(
  async (_req: Request, res: Response) => {
    res.send({
      success: true,
      data: {
        uptime: differenceInMinutes(new Date(), startTime),
        lastPingResponse,
      },
    });
  }
);
