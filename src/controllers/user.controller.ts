import { Response } from "express";
import { ForbiddenError, InvalidCredentialsError } from "src/errors";
import { z } from "zod";
import { userService } from "src/services";
import { createAccessToken } from "src/utils/create-access-token";
import { userAuthValidations } from "src/validations";
import asyncHandler from "src/utils/async-handler";
import { getEnvConfig } from "src/config";

export const userLogin = asyncHandler(
  async (
    data: z.infer<typeof userAuthValidations.userLogin>,
    res: Response
  ) => {
    const { username, password } = data.body;

    try {
      const user = await userService.verifyUserByUsernameAndPassword(
        username,
        password
      );

      const token = createAccessToken(user);

      res.send({
        success: true,
        message: "Login successful",
        data: { token },
      });
    } catch (e) {
      throw new InvalidCredentialsError();
    }
  }
);

export const userRegister = asyncHandler(
  async (
    data: z.infer<typeof userAuthValidations.userRegister>,
    res: Response
  ) => {
    if (data.body.secret !== getEnvConfig("USER_REGISTER_SECRET"))
      throw new ForbiddenError();

    try {
      const user = await userService.registerUser(data.body);

      res.send({
        success: true,
        message: "Registration successful",
        data: { user },
      });
    } catch (e) {
      throw new ForbiddenError();
    }
  }
);
