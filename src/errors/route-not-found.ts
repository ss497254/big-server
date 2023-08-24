import { createError } from "./create-error";
import { ErrorCode } from "./codes";

export interface RouteNotFoundErrorExtensions {
  path: string;
}

export const messageConstructor = ({ path }: RouteNotFoundErrorExtensions) =>
  `Route ${path} doesn't exist.`;

export const RouteNotFoundError = createError(
  ErrorCode.RouteNotFound,
  messageConstructor,
  404
);
