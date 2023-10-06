const acceptedEnvTypes = [
  "string",
  "number",
  "boolean",
  "regex",
  "json",
] as const;

export type EnvVariablesType =
  | number
  | string
  | boolean
  | RegExp
  | Record<string, any>
  | Record<string, any>[];

export interface IEnvVariable<T = EnvVariablesType> {
  value: T | undefined;
  type: (typeof acceptedEnvTypes)[number];
  setBy: "default" | "env" | "config-file" | "custom";
  required?: boolean;
  exclusive?: boolean;
}
