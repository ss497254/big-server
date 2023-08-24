import { createError } from "src/errors";
import { ErrorCode } from "./codes";

export const InvalidProviderError = createError(
  ErrorCode.InvalidProvider,
  "Invalid provider.",
  403
);
