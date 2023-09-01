export type Accountability = {
  role: string;
  username: string;
  admin?: boolean;
  permissions: string[];
  ip?: string;
  userAgent?: string;
  origin?: string;
};
