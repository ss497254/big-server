import { createError } from "./create-error";
import { ErrorCode } from "./codes";

export const ContentTooLargeError = createError(
  ErrorCode.ContentTooLarge,
  "Uploaded content is too large.",
  413
);
