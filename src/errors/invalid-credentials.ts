import { createError } from "./create-error";
import { ErrorCode } from "./codes";

export const InvalidCredentialsError = createError(
  ErrorCode.InvalidCredentials,
  "Invalid user credentials.",
  401
);
