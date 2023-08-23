import { NextFunction, Request, Response } from "express";

const logger = {
  warn: console.warn,
  info: console.info,
  error: console.error,
  trace: console.trace,
  debug: console.debug,
};

export const expressLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log(`Req: ${req.hostname} ${req.path} ${req.ip}`);
  next();
};

export default logger;
