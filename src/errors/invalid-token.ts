import { createError } from "./create-error";
import { ErrorCode } from "./codes";

export const InvalidTokenError = createError(
  ErrorCode.InvalidToken,
  "Invalid token",
  403
);
