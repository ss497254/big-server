import bcrypt from "bcryptjs";
import { UsersTable } from "src/constants";
import logger from "src/lib/logger";
import { User } from "src/types";
import { userAuthValidations } from "src/validations";
import z from "zod";
import { addItemWithId, getItemById } from "../firebase/database";
import { removeKey } from "../utils/remove-key";

export const getUser = async (username: string) => {
  const user = (await getItemById(UsersTable, username)).data();

  logger.debug("get-user", user);
  if (!user) throw new Error("User not found!");

  return removeKey("password", user) as User;
};

export const verifyUserByUsernameAndPassword = async (
  username: string,
  password: string
) => {
  const user = (await getItemById(UsersTable, username)).data();

  if (user && (await bcrypt.compare(password, user.password)))
    return removeKey("password", user) as User;

  throw new Error("invalid cred");
};

export const registerUser = async (
  user: z.infer<typeof userAuthValidations.userRegister>["body"]
) => {
  user.password = await bcrypt.hash(user.password, 4);

  await addItemWithId(UsersTable, user.username, user);

  return removeKey("password", user);
};
