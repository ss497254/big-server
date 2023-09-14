import { createError } from "./create-error";
import { ErrorCode } from "./codes";

export interface IntenalServerErrorExtensions {
  error: any;
}

export const messageConstructor = (extensions: IntenalServerErrorExtensions) =>
  extensions.error.message;

export const IntenalServerError = createError<IntenalServerErrorExtensions>(
  ErrorCode.InternalServerError,
  messageConstructor,
  500
);
