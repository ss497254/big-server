import type { RequestHandler } from "express";
import { RouteNotFoundError } from "../errors/index";

const notFound: RequestHandler = async (req, _res, next) => {
  next(new RouteNotFoundError({ path: req.path }));
};

export default notFound;
