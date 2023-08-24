import express from "express";
import { getEnvConfig } from "src/config";
import notFoundHandler from "src/controllers/not-found";
import { InvalidPayloadError } from "src/errors";
import { expressLogger } from "src/lib/logger";
import cors from "src/middleware/cors";
import errorHandler from "src/middleware/error-handler";
import extractToken from "src/middleware/extract-token";
import apiRoutes from "src/routes";

export default async function createApp(): Promise<express.Application> {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", getEnvConfig("IP_TRUST_PROXY") as number);

  app.use(expressLogger);

  app.use((_req, res, next) => {
    res.setHeader("X-Powered-By", "BigServer");
    next();
  });

  if (getEnvConfig("CORS_ENABLED")) {
    app.use(cors);
  }

  app.use((req, res, next) => {
    express.json({
      limit: getEnvConfig("MAX_REQ_PAYLOAD_SIZE") as number,
    })(req, res, (err: any) => {
      if (err) {
        return next(new InvalidPayloadError({ reason: err.message }));
      }

      return next();
    });
  });

  app.use(extractToken);

  app.get("/", (_req, res) => {
    res.json({
      message: "Hi, I'm BigServer",
    });
  });

  app.get("/server/ping", (_req, res) => res.send("pong"));

  app.use("/api", apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
