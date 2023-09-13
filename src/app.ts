import express from "express";
import { getEnvConfig } from "src/config";
import notFoundHandler from "src/controllers/not-found";
import { InvalidPayloadError } from "src/errors";
import { expressLogger } from "src/lib/logger";
import cors from "src/middleware/cors";
import errorHandler from "src/middleware/error-handler";
import extractToken from "src/middleware/extract-token";
import { setupApiRoutes } from "src/routes";

export default async function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", getEnvConfig("IP_TRUST_PROXY") as number);

  app.use(expressLogger);

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
      message: "Hi, I'm big_server",
    });
  });

  app.get("/ping", (_req, res) => res.send("pong"));

  setupApiRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
