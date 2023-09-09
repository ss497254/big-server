import jwt from "jsonwebtoken";
import { JWT_ISSUER } from "src/constants";

export function isBigServerJWT(string: string): boolean {
  try {
    const payload = jwt.decode(string, { json: true });
    if (payload?.iss !== JWT_ISSUER) return false;
    return true;
  } catch {
    return false;
  }
}
