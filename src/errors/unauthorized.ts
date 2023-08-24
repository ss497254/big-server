import { createError } from "src/errors";
import { ErrorCode } from "./codes";

export const UnauthorizedError = createError(
  ErrorCode.Unauthorized,
  "You're not authorized to access this content",
  401
);
