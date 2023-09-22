import { z } from "zod";

export const sendMessage = z.object({
  body: z
    .object({
      channel: z.string({ required_error: "channel is required" }),
      content: z.string({ required_error: "content is required" }),
      image: z.string().optional(),
    })
    .strict(),
});

export const getMessages = z.object({
  params: z
    .object({
      channel: z.string({ required_error: "channel is required" }),
    })
    .strict(),
  query: z
    .object({
      cursor: z.string({ required_error: "cursor is required" }),
    })
    .strict(),
});

export const getUserOfChannel = z.object({
  params: z
    .object({
      channel: z.string({ required_error: "channel is required" }),
    })
    .strict(),
});

export const createChannel = z.object({
  body: z
    .object({
      channel: z.string({ required_error: "channel is required" }),
      access: z.string({ required_error: "access is required" }),
    })
    .strict(),
});
