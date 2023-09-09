export type JWTTokenPayload = {
  username: string;
  admin: boolean;
  permissions: string[];
};
