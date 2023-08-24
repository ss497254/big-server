import { createError } from "./create-error";
import { ErrorCode } from "./codes";

export interface MethodNotAllowedErrorExtensions {
  allowed: string[];
  current: string;
}

export const messageConstructor = (
  extensions: MethodNotAllowedErrorExtensions
) =>
  `Invalid method "${
    extensions.current
  }" used. Should be one of ${extensions.allowed
    .map((method) => `"${method}"`)
    .join(", ")}.`;

export const MethodNotAllowedError =
  createError<MethodNotAllowedErrorExtensions>(
    ErrorCode.MethodNotAllowed,
    messageConstructor,
    405
  );
