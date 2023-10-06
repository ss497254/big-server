import { IEnvVariable } from "./types";

export const corsEnv = {
  CORS_ENABLED: {
    value: true,
    type: "boolean",
  } as IEnvVariable<boolean>,

  CORS_ORIGIN: {
    value: "*",
    type: "string",
  } as IEnvVariable<string>,

  CORS_METHODS: {
    value: "GET,POST,PATCH,DELETE",
    type: "string",
  } as IEnvVariable<string>,

  CORS_ALLOWED_HEADERS: {
    value: undefined,
    type: "string",
  } as IEnvVariable<string>,

  CORS_EXPOSED_HEADERS: {
    value: undefined,
    type: "string",
  } as IEnvVariable<string>,

  CORS_CREDENTIALS: {
    value: false,
    type: "boolean",
  } as IEnvVariable<boolean>,

  CORS_MAX_AGE: {
    value: 1000 * 60 * 24,
    type: "number",
  } as IEnvVariable<number>,
};
