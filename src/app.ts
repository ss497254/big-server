import cookieParser from "cookie-parser";
import express from "express";
import notFoundHandler from "./controllers/not-found";

import { InvalidPayloadError } from "./errors/index";
import { expressLogger } from "src/lib/logger";
import cors from "./middleware/cors";
import errorHandler from "./middleware/error-handler";
import extractToken from "src/middleware/extract-token";
// import rateLimiterGlobal from "src/middleware/rate-limiter-global";
import { getEnvConfig } from "src/config/index";

export default async function createApp(): Promise<express.Application> {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", getEnvConfig("IP_TRUST_PROXY") as number);

  app.use(expressLogger);

  app.use((_req, res, next) => {
    res.setHeader("X-Powered-By", "big_server");
    next();
  });

  if (getEnvConfig("CORS_ENABLED")) {
    app.use(cors);
  }

  // if (getEnvConfig("RATE_LIMITER_GLOBAL_ENABLED")) {
  //   app.use(rateLimiterGlobal);
  // }

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

  app.use(cookieParser());

  app.use(extractToken);

  app.get("/", (_req, res) => {
    res.json({
      message: "Hi, I'm big_server",
    });
  });

  app.get("/server/ping", (_req, res) => res.send("pong"));

  // app.use(authenticate);
  // app.use(getPermissions);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
