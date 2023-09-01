import { Router } from "express";
import user from "./user.route";

export interface IApiRoute {
  path: string;
  router: Router;
}

const API_ROUTES: IApiRoute[] = [{ path: "/user", router: user }];

export const setupApiRoutes = (router: Router) => {
  API_ROUTES.forEach((route) => {
    router.use("/api" + route.path, route.router);
  });
};
