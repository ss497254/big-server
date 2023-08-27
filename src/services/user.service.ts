import bcrypt from "bcryptjs";
import { UsersTable } from "src/constants";
import { getItem, getItemById } from "../firebase/database";
import { removeKey } from "../utils/remove-key";
import { Accountability } from "src/types";

export const getUser = async (username: string) => {
  const user = (await getItem(UsersTable, "username", "==", username))[0];

  if (!user) throw new Error("User not found!");

  return removeKey("password", user) as Accountability;
};

export const verifyUserByUsernameAndPassword = async (
  username: string,
  password: string
) => {
  const user = (await getItemById(UsersTable, username)).data();

  if (user && (await bcrypt.compare(password, user.password)))
    return removeKey("password", user) as Accountability;

  throw new Error("invalid cred");
};
