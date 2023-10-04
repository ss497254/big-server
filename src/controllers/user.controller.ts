import { Request, Response } from "express";
import { ForbiddenError, InvalidCredentialsError } from "src/errors";
import { z } from "zod";
import { chatsService, userService } from "src/services";
import { createAccessToken } from "src/utils/create-access-token";
import { userAuthValidations } from "src/validations";
import asyncHandler from "src/utils/async-handler";
import { getEnvConfig } from "src/config";
import { removeKey } from "src/utils/remove-key";
import { createSuccesResponse } from "src/utils/create-success-response";

export const userLogin = asyncHandler(
  async (
    req: Override<Request, z.infer<typeof userAuthValidations.userLogin>>,
    res: Response
  ) => {
    const { username, password } = req.body;

    try {
      const user = await userService.verifyUserByUsernameAndPassword(
        username,
        password
      );

      res.json(
        createSuccesResponse(
          {
            user,
            token: createAccessToken(user),
            channels: await chatsService.getChannels(user),
          },
          "Login successful"
        )
      );
    } catch (e) {
      throw new InvalidCredentialsError();
    }
  }
);

export const userRegister = asyncHandler(
  async (
    req: Override<Request, z.infer<typeof userAuthValidations.userRegister>>,
    res: Response
  ) => {
    if (req.body.secret !== getEnvConfig("USER_REGISTER_SECRET"))
      throw new ForbiddenError();

    try {
      const user = await userService.registerUser(
        removeKey("secret", req.body)
      );

      res.json(createSuccesResponse({ user }, "Registration successful"));
    } catch (e) {
      throw new ForbiddenError();
    }
  }
);

export const resetPassword = asyncHandler(
  async (
    req: Override<Request, z.infer<typeof userAuthValidations.resetPassword>>,
    res: Response
  ) => {
    if (req.body.secret !== getEnvConfig("USER_REGISTER_SECRET"))
      throw new ForbiddenError();

    const { username, password } = req.body;
    try {
      const data = await userService.resetPassword(username, password);

      res.json(createSuccesResponse({ data }, "Password Reset successful"));
    } catch (e) {
      throw new ForbiddenError();
    }
  }
);
