/**
 * Extract access token from:
 *
 * Authorization: Bearer
 * access_token query parameter
 *
 * and store in req.token
 */

import type { RequestHandler } from "express";

const extractToken: RequestHandler = (req, _res, next) => {
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");

    if (parts.length === 2 && parts[0]!.toLowerCase() === "bearer") {
      req.token = parts[1]!;
    }

    next();
  }
};

export default extractToken;
