import { z } from "zod";

const zodStringOrNumber = z.union([z.string(), z.number()]);

export const WebSocketMessage = z
  .object({
    type: z.string(),
    uid: zodStringOrNumber.optional(),
  })
  .passthrough();

export type WebSocketMessage = z.infer<typeof WebSocketMessage>;

export const WebSocketResponse = z.discriminatedUnion("status", [
  WebSocketMessage.extend({
    status: z.literal("ok"),
  }),
  WebSocketMessage.extend({
    status: z.literal("error"),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
      })
      .passthrough(),
  }),
]);
export type WebSocketResponse = z.infer<typeof WebSocketResponse>;

export const ConnectionParams = z.object({
  access_token: z.string().optional(),
});

export type ConnectionParams = z.infer<typeof ConnectionParams>;

export const BasicAuthMessage = z.object({ access_token: z.string() });

export type BasicAuthMessage = z.infer<typeof BasicAuthMessage>;

export const WebSocketAuthMessage = WebSocketMessage.extend({
  type: z.literal("auth"),
}).and(BasicAuthMessage);

export type WebSocketAuthMessage = z.infer<typeof WebSocketAuthMessage>;
