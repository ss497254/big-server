import fs from "fs";
import path from "path";
import { toBoolean } from "src/utils/to-boolean";

const acceptedEnvTypes = [
  "string",
  "number",
  "boolean",
  "regex",
  "json",
] as const;

export interface IEnvVariable {
  value: number | string | boolean | any[] | RegExp | undefined;
  type: (typeof acceptedEnvTypes)[number];
  setBy: "default" | "env" | "config-file" | "custom";
  deleteFromProcess?: boolean;
}

export type EnvKeysType =
  | "NODE_ENV"
  | "HOST"
  | "PORT"
  | "PUBLIC_URL"
  | "CONFIG_PATH"
  | "CORS_ENABLED"
  | "CORS_ORIGIN"
  | "CORS_METHODS"
  | "CORS_ALLOWED_HEADERS"
  | "CORS_EXPOSED_HEADERS"
  | "CORS_CREDENTIALS"
  | "CORS_MAX_AGE"
  | "WEBSOCKETS_ENABLED"
  | "SERVER_SHUTDOWN_TIMEOUT"
  | "IP_TRUST_PROXY"
  | "MAX_REQ_PAYLOAD_SIZE";

const env: Record<EnvKeysType, IEnvVariable> = {
  NODE_ENV: {
    value: "development",
    type: "string",
    setBy: "default",
  },
  HOST: {
    value: "127.0.0.1",
    type: "string",
    setBy: "default",
  },
  PORT: {
    value: "8080",
    type: "number",
    setBy: "default",
  },
  PUBLIC_URL: {
    value: undefined,
    type: "string",
    setBy: "default",
  },
  CONFIG_PATH: {
    value: undefined,
    type: "string",
    setBy: "default",
  },
  CORS_ENABLED: {
    value: false,
    type: "boolean",
    setBy: "default",
  },
  CORS_ORIGIN: {
    value: undefined,
    type: "string",
    setBy: "default",
  },
  CORS_METHODS: {
    value: undefined,
    type: "string",
    setBy: "default",
  },
  CORS_ALLOWED_HEADERS: {
    value: undefined,
    type: "string",
    setBy: "default",
  },
  CORS_EXPOSED_HEADERS: {
    value: undefined,
    type: "string",
    setBy: "default",
  },
  CORS_CREDENTIALS: {
    value: undefined,
    type: "string",
    setBy: "default",
  },
  CORS_MAX_AGE: {
    value: undefined,
    type: "string",
    setBy: "default",
  },
  SERVER_SHUTDOWN_TIMEOUT: {
    value: 10,
    type: "number",
    setBy: "default",
  },
  WEBSOCKETS_ENABLED: {
    value: true,
    type: "boolean",
    setBy: "default",
  },
  IP_TRUST_PROXY: {
    value: 0,
    type: "number",
    setBy: "default",
  },
  MAX_REQ_PAYLOAD_SIZE: {
    value: 1000 * 100,
    type: "number",
    setBy: "default",
  },
};

export function getEnv() {
  return env;
}

export function getEnvConfig(key: EnvKeysType) {
  return env[key].value;
}

export function setupConfig() {
  const keys = Object.keys(env) as EnvKeysType[];
  const config = loadConfiguration();

  for (const key of keys) {
    if (process.env[key]) {
      parseEnv(key, process.env[key], "env");

      // delete important variables from process.env
      // for security reasons
      if (env[key].deleteFromProcess) delete process.env[key];
    } else if (config[key]) parseEnv(key, config[key], "config-file");
  }
}

function loadConfiguration() {
  const configPath = path.resolve(process.env["CONFIG_PATH"]!);

  if (fs.existsSync(configPath) === false) return {};

  const fileExt = path.extname(configPath).toLowerCase();

  if (fileExt === ".js") {
    const module = require(configPath);
    const exported = module.default || module;

    if (typeof exported === "function") {
      return exported(process.env);
    } else if (typeof exported === "object") {
      return exported;
    }

    throw new Error(
      `Invalid JS configuration file export type. Requires one of "function", "object", received: "${typeof exported}"`
    );
  } else if (fileExt === ".json") {
    return require(configPath);
  }

  throw new Error(
    `Invalid configuration file format. Requires one of "js", "json", received: "${fileExt}"`
  );
}

function parseEnv(key: EnvKeysType, value: any, setBy: IEnvVariable["setBy"]) {
  const { type } = env[key];

  if (type === "string") env[key].value = value;
  else if (type === "boolean") env[key].value = toBoolean(value);
  else if (type === "number") env[key].value = parseFloat(value);
  else if (type === "regex") env[key].value = new RegExp(value);
  else if (type === "json") env[key].value = JSON.parse(value);
  else throw new Error(`Unexpected Env variable type for ${key}`);

  env[key].setBy = setBy;
}
