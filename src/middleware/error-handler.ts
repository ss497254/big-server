import { isBigServerError } from "src/errors";
import type { ErrorRequestHandler } from "express";
import logger from "src/lib/logger";
import { __prod__ } from "src/config";

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let payload = {
    success: false,
    status: 500,
    message: "INTERNAL_SERVER_ERROR",
    error: {
      name: err.name,
      message: err.message || err?.toString(),
      stack: err.stack,
      cause: err.cause,
    },
  } as any;

  if (isBigServerError(err)) {
    logger.debug(err.code, err.message);

    payload.status = err.status;
    payload.message = err.code;
  } else {
    logger.error(err.message || err?.toString(), err.stack);
  }

  if (req.accountability?.admin !== true && __prod__) {
    payload.error = undefined;
  }

  res.status(payload.status);

  return res.json(payload);
};

export default errorHandler;
