import { createError } from "src/errors";
import { ErrorCode } from "./codes";

export const TokenExpiredError = createError(
  ErrorCode.TokenExpired,
  "Token expired.",
  401
);
