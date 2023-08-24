import { createError } from "./create-error";
import { ErrorCode } from "./codes";

export interface UnsupportedMediaTypeErrorExtensions {
  mediaType: string;
  where: string;
}

export const messageConstructor = (
  extensions: UnsupportedMediaTypeErrorExtensions
) => `Unsupported media type "${extensions.mediaType}" in ${extensions.where}.`;

export const UnsupportedMediaTypeError =
  createError<UnsupportedMediaTypeErrorExtensions>(
    ErrorCode.UnsupportedMediaType,
    messageConstructor,
    415
  );
