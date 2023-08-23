import cors from "cors";
import type { RequestHandler } from "express";
import { getEnvConfig } from "src/config";

let corsMiddleware: RequestHandler = (_req, _res, next) => next();

if (getEnvConfig("CORS_ENABLED")) {
  corsMiddleware = cors({
    origin: getEnvConfig("CORS_ORIGIN"),
    methods: getEnvConfig("CORS_METHODS"),
    allowedHeaders: getEnvConfig("CORS_ALLOWED_HEADERS"),
    exposedHeaders: getEnvConfig("CORS_EXPOSED_HEADERS"),
    credentials: getEnvConfig("CORS_CREDENTIALS"),
    maxAge: getEnvConfig("CORS_MAX_AGE"),
  });
}

export default corsMiddleware;
