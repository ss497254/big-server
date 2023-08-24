import { createError } from "./create-error";
import { ErrorCode } from "./codes";

export interface ValueOutOfRangeErrorExtensions {
  collection: string | null;
  field: string | null;
}

export const messageConstructor = ({
  collection,
  field,
}: ValueOutOfRangeErrorExtensions) => {
  let message = "Numeric value ";

  if (field) {
    message += `for field "${field}" `;
  }

  if (collection) {
    message += `in collection "${collection}" `;
  }

  message += `is out of range.`;

  return message;
};

export const ValueOutOfRangeError = createError<ValueOutOfRangeErrorExtensions>(
  ErrorCode.ValueOutOfRange,
  messageConstructor,
  400
);
