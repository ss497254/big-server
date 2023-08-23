export type Accountability = {
  role: string;
  user: string;
  admin?: boolean;
  app?: boolean;
  ip?: string;
  userAgent?: string;
  origin?: string;
};
