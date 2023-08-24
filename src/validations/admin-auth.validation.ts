import { z } from "zod";

export const adminLogin = z.object({
  body: z
    .object({
      username: z.string({ required_error: "username is required" }),
      password: z.string({ required_error: "password is required" }),
    })
    .strict(),
});
