import { getEnvConfig } from "src/config";
import type { Accountability } from "src/types";
import { InvalidTokenError } from "src/errors";
import { isBigServerJWT } from "./is-big-server-jwt";
import { verifyAccessJWT } from "./jwt";

export async function getAccountabilityForToken(
  token?: string | null,
  accountability: Partial<Accountability> = {}
): Promise<Accountability> {
  if (token) {
    if (isBigServerJWT(token)) {
      const payload = verifyAccessJWT(token, getEnvConfig("JWT_SECRET"));

      accountability = { ...accountability, ...payload };

      return accountability as Accountability;
    }
  }

  throw new InvalidTokenError();
}
