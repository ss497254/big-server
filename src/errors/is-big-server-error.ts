import type { BigServerError } from "./create-error";

export const isBigServerError = <T = unknown>(
  err: unknown,
  code?: string
): err is BigServerError<T> => {
  const isBigServerError =
    typeof err === "object" &&
    err !== null &&
    Array.isArray(err) === false &&
    "name" in err &&
    err.name === "BigServerError";

  if (code) {
    return isBigServerError && "code" in err && err.code === code.toUpperCase();
  }

  return isBigServerError;
};
