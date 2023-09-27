import { getEnvConfig } from "src/config";
import type { Accountability } from "src/types";
import { InvalidTokenError } from "src/errors";
import { isBigServerJWT } from "./is-big-server-jwt";
import { verifyAccessJWT } from "./jwt";

export async function getAccountabilityForToken(
  token?: string | null,
  accountability: Partial<Accountability> = {}
): Promise<Accountability> {
  if (token && isBigServerJWT(token)) {
    return {
      ...accountability,
      ...verifyAccessJWT(token, getEnvConfig("JWT_SECRET")),
    } as Accountability;
  }

  throw new InvalidTokenError();
}
