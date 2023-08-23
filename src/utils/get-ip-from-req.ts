import type { Request } from "express";

export function getIPFromReq(req: Request): string {
  const ip = req.ip;

  // IP addresses starting with ::ffff: are IPv4 addresses in IPv6 format. We can strip the prefix to get back to IPv4
  return ip.startsWith("::ffff:") ? ip.substring(7) : ip;
}
