import { createError } from "./create-error";
import { ErrorCode } from "./codes";

export interface ValueTooLongErrorExtensions {
  collection: string | null;
  field: string | null;
}

export const messageConstructor = ({
  collection,
  field,
}: ValueTooLongErrorExtensions) => {
  let message = "Value ";

  if (field) {
    message += `for field "${field}" `;
  }

  if (collection) {
    message += `in collection "${collection}" `;
  }

  message += `is too long.`;

  return message;
};

export const ValueTooLongError = createError<ValueTooLongErrorExtensions>(
  ErrorCode.ValueTooLong,
  messageConstructor,
  400
);
