import { isBigServerError } from "src/errors";
import type { ErrorRequestHandler } from "express";
import { ErrorCode, MethodNotAllowedError } from "src/errors";
import logger from "src/lib/logger";
import { __prod__ } from "src/config";

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let payload = {
    success: false,
    status: 500,
    message: "INTERNAL_SERVER_ERROR",
  };

  let errors = [];

  if (!__prod__) {
    err.extensions = {
      ...(err.extensions || {}),
      stack: err.stack,
    };
  }

  if (isBigServerError(err)) {
    logger.debug(err.code, err.message);

    payload.status = err.status;
    payload.message = err.message;
    errors.push(err);

    if (isBigServerError(err, ErrorCode.MethodNotAllowed)) {
      res.header(
        "Allow",
        (
          err as InstanceType<typeof MethodNotAllowedError>
        ).extensions.allowed.join(", ")
      );
    }
  } else {
    logger.error(err);

    errors = [err];
    if (req.accountability?.admin === true) {
      errors = [
        {
          message: err.message,
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            ...err.extensions,
          },
        },
      ];
    } else {
      errors = [
        {
          message: "An unexpected error occurred.",
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        },
      ];
    }
  }

  res.status(payload.status);

  return res.json({ ...payload, errors });
};

export default errorHandler;
