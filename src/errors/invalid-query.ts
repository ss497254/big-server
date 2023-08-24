import { createError } from "./create-error";
import { ErrorCode } from "./codes";

export interface InvalidQueryErrorExtensions {
  reason: string;
}

export const messageConstructor = ({ reason }: InvalidQueryErrorExtensions) =>
  `Invalid query. ${reason}.`;

export const InvalidQueryError = createError<InvalidQueryErrorExtensions>(
  ErrorCode.InvalidQuery,
  messageConstructor,
  400
);
