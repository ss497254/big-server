import { IEnvVariable } from "./types";

export const pingEnv = {
  PING_URL: {
    value: undefined,
    type: "string",
  } as IEnvVariable<string>,

  PING_INTERVAL: {
    value: 10 * 60 * 1000, // 10 minutes
    type: "number",
  } as IEnvVariable<number>,
};
