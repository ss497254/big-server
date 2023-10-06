import { IEnvVariable } from "./types";

export const serverEnv = {
  HOST: {
    value: "127.0.0.1",
    type: "string",
  } as IEnvVariable<string>,

  PORT: {
    value: 8080,
    type: "number",
  } as IEnvVariable<number>,

  PUBLIC_URL: {
    value: undefined,
    type: "string",
  } as IEnvVariable<string>,

  SERVER_SHUTDOWN_TIMEOUT: {
    value: 10 * 1000, // 10 sec
    type: "number",
  } as IEnvVariable<number>,

  IP_TRUST_PROXY: {
    value: 0,
    type: "number",
  } as IEnvVariable<number>,

  MAX_REQ_PAYLOAD_SIZE: {
    value: 1000 * 1000, // 1 MB
    type: "number",
  } as IEnvVariable<number>,
};
