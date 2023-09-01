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
      role: z.string({ required_error: "role is required" }),
      admin: z.boolean().default(false),
      permission: z.array(z.string()).default([]),
      secret: z.string({ required_error: "secret is required" }),
    })
    .strict(),
});
