import { createError } from "./create-error";
import { ErrorCode } from "./codes";

export const UnexpectedResponseError = createError(
  ErrorCode.UnexpectedResponse,
  "Received an unexpected response.",
  503
);
