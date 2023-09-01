import { NextFunction, Request, Response } from "express";
import winston from "winston";

const logFormat = winston.format.printf(function (info) {
  if (typeof info.message == "object")
    return `${info.level}: ${JSON.stringify(info.message)}`;

  return `${info.level}: ${info.message}`;
});

class Logger {
  logger: winston.Logger;

  constructor() {
    let transports = [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), logFormat),
      }),
    ];

    this.logger = winston.createLogger({
      level: "debug",
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
      },
      transports,
    });
  }
}

const { logger } = new Logger();

export const expressLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.http(`Request: ${req.method} ${req.hostname} ${req.path} ${req.ip}`);
  next();
};

export default logger;
