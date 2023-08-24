import { createError } from "./create-error";
import { ErrorCode } from "./codes";

export const InvalidIpError = createError(
  ErrorCode.InvalidIp,
  "Invalid IP address.",
  401
);
