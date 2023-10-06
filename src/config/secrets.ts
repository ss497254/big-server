import { IEnvVariable } from "./types";

export const secretEnv = {
  JWT_SECRET: {
    value: "",
    type: "string",
    required: true,
  } as IEnvVariable<string>,

  JWT_TOKEN_EXPIRY: {
    value: 24 * 36 * 36 * 1000, // 1 day
    type: "number",
  } as IEnvVariable<number>,

  USER_REGISTER_SECRET: {
    value: undefined,
    type: "string",
  } as IEnvVariable<string>,
};
