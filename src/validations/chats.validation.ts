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
      limit: z.string().optional(),
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
      users: z.array(z.string()).default([]),
    })
    .strict(),
});

export const addUserToChannel = z.object({
  body: z
    .object({
      channel: z.string({ required_error: "channel is required" }),
      users: z.array(z.string({ required_error: "users are required" })),
    })
    .strict(),
});

export const deleteChannel = z.object({
  body: z
    .object({
      channel: z.string({ required_error: "channel is required" }),
    })
    .strict(),
});
