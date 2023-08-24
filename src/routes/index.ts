import { Router } from "express";
import admin from "./admin.route";

export interface IApiRoute {
  path: string;
  router: Router;
}

const API_ROUTES: IApiRoute[] = [{ path: "/admin", router: admin }];

const router = Router();

API_ROUTES.forEach((route) => {
  router.use(route.path, route.router);
});

export default Router;
