import { createError } from "src/errors";
import { ErrorCode } from "./codes";

export interface NotNullViolationErrorExtensions {
  collection: string | null;
  field: string | null;
}

export const messageConstructor = ({
  collection,
  field,
}: NotNullViolationErrorExtensions) => {
  let message = "Value ";

  if (field) {
    message += `for field "${field}" `;
  }

  if (collection) {
    message += `in collection "${collection}" `;
  }

  message += `can't be null.`;

  return message;
};

export const NotNullViolationError =
  createError<NotNullViolationErrorExtensions>(
    ErrorCode.NotNullViolation,
    messageConstructor,
    400
  );
