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

export const __prod__ = process.env.NODE_ENV === "production";

export interface IEnvVariable<T = EnvVariablesType> {
  value: T | undefined;
  type: (typeof acceptedEnvTypes)[number];
  setBy: "default" | "env" | "config-file" | "custom";
  required?: boolean;
  exclusive?: boolean;
}

const env = {
  // Server config variables
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

  PING_URL: {
    value: undefined,
    type: "string",
  } as IEnvVariable<string>,

  CONFIG_PATH: {
    value: "config.json",
    type: "string",
  } as IEnvVariable<string>,

  RATE_LIMITER_GLOBAL_ENABLED: {
    value: false,
    type: "boolean",
  } as IEnvVariable<boolean>,

  SERVER_SHUTDOWN_TIMEOUT: {
    value: 10 * 1000,
    type: "number",
  } as IEnvVariable<number>,

  IP_TRUST_PROXY: {
    value: 0,
    type: "number",
  } as IEnvVariable<number>,

  MAX_REQ_PAYLOAD_SIZE: {
    value: 1000 * 1000,
    type: "number",
  } as IEnvVariable<number>,

  // Secrets
  JWT_SECRET: {
    value: "",
    type: "string",
    required: true,
  } as IEnvVariable<string>,

  JWT_TOKEN_EXPIRY: {
    value: 24 * 36 * 36 * 1000,
    type: "number",
  } as IEnvVariable<number>,

  USER_REGISTER_SECRET: {
    value: undefined,
    type: "string",
  } as IEnvVariable<string>,

  // cors
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

  // web socket
  WEBSOCKETS_ENABLED: {
    value: true,
    type: "boolean",
  } as IEnvVariable<boolean>,

  WEBSOCKETS_HEARTBEAT_PERIOD: {
    value: 5 * 60 * 1000,
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

  // firebase
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

export type EnvKeysType = keyof typeof env;
export type EnvVariablesType =
  | number
  | string
  | boolean
  | RegExp
  | Record<string, any>
  | Record<string, any>[];

export function getEnv() {
  return env;
}

export function getEnvConfig<T = any>(key: EnvKeysType) {
  return env[key].value as T;
}

export function setupConfig() {
  const keys = Object.keys(env) as EnvKeysType[];
  const config = loadConfiguration();

  for (const key of keys) {
    if (process.env[key]) {
      // extract from process
      parseEnv(key, process.env[key], "env");

      // this variable should only be accessed from getEnvConfig
      if (env[key].exclusive) delete process.env[key];
    } else if (config[key]) {
      // load from config file
      parseEnv(key, config[key], "config-file");
    } else if (env[key].required) {
      throw new Error(`env variable ${key} is required`);
    } else {
      // default value
      env[key].setBy = "default";
    }
  }
}

function parseEnv(
  key: EnvKeysType,
  value: any,
  setBy: IEnvVariable<Partial<EnvVariablesType>>["setBy"]
) {
  const { type } = env[key];

  if (type === "string") env[key].value = value;
  else if (type === "boolean") env[key].value = toBoolean(value);
  else if (type === "number") env[key].value = parseFloat(value);
  else if (type === "regex") env[key].value = new RegExp(value) as any;
  else if (type === "json") env[key].value = JSON.parse(value);
  else throw new Error(`Unexpected Env variable type for ${key}`);

  env[key].setBy = setBy;
}

function loadConfiguration() {
  const configPath = path.resolve(
    process.env["CONFIG_PATH"] || env["CONFIG_PATH"].value!
  );

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
