import { createError } from "./create-error";
import { ErrorCode } from "./codes";

export const ForbiddenError = createError(
  ErrorCode.Forbidden,
  `You don't have permission to access this.`,
  403
);
