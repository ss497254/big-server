import winston from "winston";
import { NextFunction, Request, Response } from "express";

const logFormat = winston.format.printf(function (info) {
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
  logger.info(`Req: ${req.hostname} ${req.path} ${req.ip}`);
  next();
};

export default logger;
