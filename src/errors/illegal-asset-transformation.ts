import { createError } from "src/errors";
import { ErrorCode } from "./codes";

export interface IllegalAssetTransformationErrorExtensions {
  invalidTransformations: string[];
}

export const IllegalAssetTransformationError =
  createError<IllegalAssetTransformationErrorExtensions>(
    ErrorCode.IllegalAssetTransformation,
    "Illegal asset transformation.",
    400
  );
