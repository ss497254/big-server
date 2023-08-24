import { sign } from "jsonwebtoken";
import { Accountability } from "src/types";
import { getEnvConfig } from "src/config";

export const createAccessToken = (data: Accountability) => {
  return sign(data, getEnvConfig("JWT_SECRET"), {
    expiresIn: 60 * 24,
    algorithm: "HS256",
  });
};
