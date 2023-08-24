import bcrypt from "bcryptjs";
import { AdminsTable } from "src/constants";
import { getItem, getItemById } from "../firebase/database";
import { removeKey } from "../utils/remove-key";

export const getAdmin = async (username: string) => {
  const user = (await getItem(AdminsTable, "username", "==", username))[0];

  if (!user) throw new Error("User not found!");

  return removeKey("password", user);
};

export const verifyAdminByUsernameAndPassword = async (
  username: string,
  password: string
) => {
  const user = (await getItemById(AdminsTable, username)).data();

  if (user && (await bcrypt.compare(password, user.password))) return username;

  throw new Error("invalid cred");
};
