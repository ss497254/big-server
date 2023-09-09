import jwt from "jsonwebtoken";
import { JWT_ISSUER } from "src/constants";
import {
  InvalidTokenError,
  ServiceUnavailableError,
  TokenExpiredError,
} from "src/errors";
import type { JWTTokenPayload } from "src/types";

export function verifyJWT(token: string, secret: string): Record<string, any> {
  let payload;

  try {
    payload = jwt.verify(token, secret, {
      issuer: JWT_ISSUER,
      algorithms: ["HS256"],
    }) as Record<string, any>;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new TokenExpiredError();
    } else if (err instanceof jwt.JsonWebTokenError) {
      throw new InvalidTokenError();
    } else {
      throw new ServiceUnavailableError({
        service: "jwt",
        reason: `Couldn't verify token.`,
      });
    }
  }

  return payload;
}

export function verifyAccessJWT(
  token: string,
  secret: string
): JWTTokenPayload {
  const { username, admin, permissions } = verifyJWT(token, secret);

  if (
    username === undefined ||
    admin === undefined ||
    !Array.isArray(permissions)
  ) {
    throw new InvalidTokenError();
  }

  return { username, admin, permissions };
}
