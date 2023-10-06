import { IEnvVariable } from "./types";

export const websocketEnv = {
  WEBSOCKETS_ENABLED: {
    value: true,
    type: "boolean",
  } as IEnvVariable<boolean>,

  WEBSOCKETS_HEARTBEAT_PERIOD: {
    value: 60 * 1000,
    type: "number",
  } as IEnvVariable<number>,

  WEBSOCKETS_ENDPOINT: {
    value: "/ws",
    type: "string",
  } as IEnvVariable<string>,

  WEBSOCKETS_CONN_LIMIT: {
    value: 20,
    type: "number",
  } as IEnvVariable<number>,
};
