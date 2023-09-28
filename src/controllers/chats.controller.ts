import { Request, Response } from "express";
import z from "zod";
import asyncHandler from "src/utils/async-handler";
import { chatsValidations } from "src/validations";
import { chatsService } from "src/services";
import { IntenalServerError } from "src/errors";
import { createSuccesResponse } from "src/utils/create-success-response";
import { createEmptyChannel } from "src/utils/create-empty-channel";

export const sendMessage = asyncHandler(
  async (
    req: Override<Request, z.infer<typeof chatsValidations.sendMessage>>,
    res: Response
  ) => {
    const { username } = req.accountability!;
    const { channel, content, image } = req.body;

    try {
      const data = await chatsService.sendMessage(
        channel,
        username,
        content,
        image
      );

      res.json(createSuccesResponse(data));
    } catch (error) {
      throw new IntenalServerError({ error });
    }
  }
);

export const getMessages = asyncHandler(
  async (
    req: Override<Request, z.infer<typeof chatsValidations.getMessages>>,
    res: Response
  ) => {
    const { cursor } = req.query;
    const { channel } = req.params;

    try {
      const data = await chatsService.getMessages(channel, cursor);

      res.json(createSuccesResponse(data));
    } catch (error) {
      throw new IntenalServerError({ error });
    }
  }
);

export const getChannels = asyncHandler(async (req: Request, res: Response) => {
  try {
    const data = await chatsService.getChannels(req.accountability!);

    res.json(createSuccesResponse(data));
  } catch (error) {
    throw new IntenalServerError({ error });
  }
});

export const getUserOfChannel = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { channel } = req.params;
      const data = chatsService.getUsersOfChannel(channel);

      res.json(createSuccesResponse(data));
    } catch (error) {
      throw new IntenalServerError({ error });
    }
  }
);

export const createChannel = asyncHandler(
  async (
    req: Override<Request, z.infer<typeof chatsValidations.createChannel>>,
    res: Response
  ) => {
    const { channel, access } = req.body;

    try {
      const data = await chatsService.createChannel(
        channel,
        createEmptyChannel(access)
      );

      res.json(createSuccesResponse(data));
    } catch (error) {
      throw new IntenalServerError({
        error,
      });
    }
  }
);
