import { Response } from "express";
import { InvalidCredentialsError } from "src/errors";
import { z } from "zod";
import { adminService } from "src/services";
import { createAccessToken } from "src/utils/create-access-token";
import { adminAuthValidations } from "src/validations";

export const adminLogin = async (
  data: z.infer<typeof adminAuthValidations.adminLogin>,
  res: Response
) => {
  const { username, password } = data.body;

  try {
    const user = await adminService.verifyAdminByUsernameAndPassword(
      username,
      password
    );

    const token = createAccessToken({
      user,
      role: "admin",
      admin: true,
    });

    res.send({
      success: true,
      message: "Login successful",
      data: { token },
    });
  } catch (e) {
    throw new InvalidCredentialsError();
  }
};
