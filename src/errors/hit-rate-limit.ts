import { createError } from "./create-error";
import ms from "ms";
import { ErrorCode } from "./codes";

export interface HitRateLimitErrorExtensions {
  limit: number;
  reset: Date;
}

export const messageConstructor = (extensions: HitRateLimitErrorExtensions) => {
  const msBeforeNext = extensions.reset.getTime() - Date.now();
  return `Too many requests, retry after ${ms(msBeforeNext)}.`;
};

export const HitRateLimitError = createError<HitRateLimitErrorExtensions>(
  ErrorCode.RequestsExceeded,
  messageConstructor,
  429
);
