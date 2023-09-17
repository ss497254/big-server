import { z } from "zod";

export const userLogin = z.object({
  body: z
    .object({
      username: z.string({ required_error: "username is required" }),
      password: z.string({ required_error: "password is required" }),
    })
    .strict(),
});

export const userRegister = z.object({
  body: z
    .object({
      username: z.string({ required_error: "username is required" }),
      password: z.string({ required_error: "password is required" }),
      admin: z.boolean().default(false),
      permissions: z.array(z.string()).default([]),
      secret: z.string({ required_error: "secret is required" }),
    })
    .strict(),
});
