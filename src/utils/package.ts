import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { name, version } = JSON.parse(
  readFileSync(resolve(__dirname, "../../package.json"), "utf8")
) as {
  name: string;
  version: string;
};

export { name, version };
