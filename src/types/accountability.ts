export type Accountability = {
  username: string;
  admin?: boolean;
  permissions: string[];
  ip?: string;
  userAgent?: string;
  origin?: string;
};
