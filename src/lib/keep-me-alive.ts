import axios, { AxiosResponse } from "axios";
import { __prod__, getEnvConfig } from "src/config";
import logger from "./logger";

const pingUrl = getEnvConfig("PING_URL");
const pongUrl = getEnvConfig("PUBLIC_URL") + "/ping";
export let lastPingResponse: AxiosResponse["data"];

export const KeepMeAlive = async () => {
  if (!pingUrl || !__prod__) return;

  let nextPing = getEnvConfig("PING_INTERVAL");

  try {
    logger.info("Sending ping request");

    const res = await axios.post(pingUrl, { url: pongUrl });
    lastPingResponse = res.data;

    logger.info("Ping successful");
  } catch (e) {
    logger.warn("Ping failed,", e);
    nextPing = 1000 * 60; // 1 minute
  }

  setTimeout(KeepMeAlive, nextPing);
};
