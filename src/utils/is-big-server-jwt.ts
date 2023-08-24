import jwt from "jsonwebtoken";

export function isBigServerJWT(string: string): boolean {
  try {
    const payload = jwt.decode(string, { json: true });
    if (payload?.iss !== "BigServer") return false;
    return true;
  } catch {
    return false;
  }
}
