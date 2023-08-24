import { isBigServerError } from "src/errors";
import type { ErrorRequestHandler } from "express";
import { ErrorCode, MethodNotAllowedError } from "src/errors";
import logger from "src/lib/logger";

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let payload: any = {
    errors: [],
  };

  const errors = [err];

  let status: number | null = null;

  for (const err of errors) {
    if (isBigServerError(err)) {
      logger.debug(err);

      if (!status) {
        status = err.status;
      } else if (status !== err.status) {
        status = 500;
      }

      payload.errors.push({
        message: err.message,
        extensions: {
          code: err.code,
          ...(err.extensions ?? {}),
        },
      });

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

      status = 500;

      if (req.accountability?.admin === true) {
        payload = {
          errors: [
            {
              message: err.message,
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
                ...err.extensions,
              },
            },
          ],
        };
      } else {
        payload = {
          errors: [
            {
              message: "An unexpected error occurred.",
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            },
          ],
        };
      }
    }
  }

  res.status(status ?? 500);

  return res.json({ ...payload });
};

export default errorHandler;
