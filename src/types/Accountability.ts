import { User } from "./User";

export interface Accountability extends User {
  username: string;
  admin?: boolean;
  permissions: string[];
  ip?: string;
  userAgent?: string;
  origin?: string;
}
