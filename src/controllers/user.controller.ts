import { Response } from "express";
import { InvalidCredentialsError } from "src/errors";
import { z } from "zod";
import { userService } from "src/services";
import { createAccessToken } from "src/utils/create-access-token";
import { userAuthValidations } from "src/validations";
import asyncHandler from "src/utils/async-handler";

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
