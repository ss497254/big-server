import { z } from "zod";

export const userLogin = z.object({
  body: z
    .object({
      email: z.string({ required_error: "email is required" }),
      password: z.string({ required_error: "password is required" }),
    })
    .strict(),
});
