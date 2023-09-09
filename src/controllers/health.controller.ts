import { Request, Response } from "express";
import { InvalidCredentialsError } from "src/errors";
import asyncHandler from "src/utils/async-handler";
import { differenceInMinutes } from "date-fns";
import { lastPingResponse } from "src/lib/keep-me-alive";

const startTime = new Date();

export const getHealthStatus = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      res.send({
        success: true,
        data: {
          uptime: differenceInMinutes(new Date(), startTime),
          lastPingResponse,
        },
      });
    } catch (e) {
      throw new InvalidCredentialsError();
    }
  }
);
