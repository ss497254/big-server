import { IEnvVariable } from "./types";

export const firebaseEnv = {
  FIREBASE_CLIENT_EMAIL: {
    value: undefined,
    type: "string",
    required: true,
    exclusive: true,
  } as IEnvVariable<string>,

  FIREBASE_PROJECT_ID: {
    value: undefined,
    type: "string",
    required: true,
    exclusive: true,
  } as IEnvVariable<string>,

  FIREBASE_BUCKET_NAME: {
    value: undefined,
    type: "string",
    required: true,
    exclusive: true,
  } as IEnvVariable<string>,

  FIREBASE_PRIVATE_KEY: {
    value: undefined,
    type: "string",
    required: true,
    exclusive: true,
  } as IEnvVariable<string>,
} as const;
