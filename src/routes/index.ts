import express, { Router } from "express";
import userRoute from "./user.route";
import adminRoute from "./admin.route";

export interface IApiRoute {
  path: string;
  router: Router;
}

export const setupApiRoutes = (router: Router) => {
  const apiRouter = express.Router();

  apiRouter.use("/user", userRoute);
  apiRouter.use("/admin", adminRoute);

  router.use("/api", apiRouter);
};
