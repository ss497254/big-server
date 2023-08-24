import { createError } from "src/errors";
import { ErrorCode } from "./codes";

interface ServiceUnavailableErrorExtensions {
  service: string;
  reason: string;
}

export const messageConstructor = ({
  service,
  reason,
}: ServiceUnavailableErrorExtensions) =>
  `Service "${service}" is unavailable. ${reason}.`;

export const ServiceUnavailableError =
  createError<ServiceUnavailableErrorExtensions>(
    ErrorCode.ServiceUnavailable,
    messageConstructor,
    503
  );
