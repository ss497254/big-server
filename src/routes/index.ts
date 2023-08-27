import { Router } from "express";
import user from "./user.route";

export interface IApiRoute {
  path: string;
  router: Router;
}

const API_ROUTES: IApiRoute[] = [{ path: "/user", router: user }];

const router = Router();

API_ROUTES.forEach((route) => {
  router.use(route.path, route.router);
});

export default Router;
