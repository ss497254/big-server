import { sign } from "jsonwebtoken";
import { Accountability } from "src/types";
import { getEnvConfig } from "src/config";
import { JWT_ISSUER } from "src/constants";

export const createAccessToken = (data: Accountability) => {
  return sign(data, getEnvConfig<string>("JWT_SECRET"), {
    expiresIn: getEnvConfig("JWT_TOKEN_EXPIRY"),
    algorithm: "HS256",
    issuer: JWT_ISSUER,
  });
};
