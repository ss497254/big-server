import type { Accountability } from "src/types";
import type { NextFunction, Request, Response } from "express";
import asyncHandler from "src/utils/async-handler";
import { getAccountabilityForToken } from "src/utils/get-accountability-for-token";
import { getIPFromReq } from "src/utils/get-ip-from-req";
import { UnauthorizedError } from "src/errors";

export const handler = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.token) throw new UnauthorizedError();

  const defaultAccountability: Partial<Accountability> = {
    admin: false,
    permissions: [],
    ip: getIPFromReq(req),
  };

  const userAgent = req.get("user-agent");
  if (userAgent) defaultAccountability.userAgent = userAgent;

  const origin = req.get("origin");
  if (origin) defaultAccountability.origin = origin;

  req.accountability = await getAccountabilityForToken(
    req.token,
    defaultAccountability
  );

  return next();
};

export default asyncHandler(handler);
