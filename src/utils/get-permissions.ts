import { Accountability } from "src/types";

export const getPermissions = async (accountability: Accountability) =>
  accountability.permissions || [];
