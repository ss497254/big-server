import fs from "fs";
import path from "path";
import { toBoolean } from "src/utils/to-boolean";
import { EnvVariablesType, IEnvVariable } from "./types";
import { websocketEnv } from "./websocket";
import { corsEnv } from "./cors";
import { firebaseEnv } from "./firebase";
import { pingEnv } from "./ping";
import { serverEnv } from "./server";
import { rateLimiterEnv } from "./rate-limiter";
import { secretEnv } from "./secrets";

export const __prod__ = process.env.NODE_ENV === "production";

const env = {
  CONFIG_PATH: {
    value: "config.json",
    type: "string",
  } as IEnvVariable<string>,

  ...serverEnv,
  ...rateLimiterEnv,
  ...secretEnv,
  ...pingEnv,
  ...corsEnv,
  ...websocketEnv,
  ...firebaseEnv,
} as const;

export type EnvKeysType = keyof typeof env;

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
