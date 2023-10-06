import { IEnvVariable } from "./types";

export const rateLimiterEnv = {
  RATE_LIMITER_GLOBAL_ENABLED: {
    value: false,
    type: "boolean",
  } as IEnvVariable<boolean>,

  RATE_LIMITER_POINTS: {
    value: 60,
    type: "number",
  } as IEnvVariable<number>,
};
