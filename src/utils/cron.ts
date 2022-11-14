import axios from "axios";
import {delayInSecond} from "./datetime";

// Second
export const EVERY_THREE_SECONDS = "*/3 * * * * *";
export const EVERY_TEN_SECONDS = "*/10 * * * * *";

// Minute
export const EVERY_TEN_MINUTES = "0 */10 * * * *";
export const EVERY_ONE_MINUTES = "0 */1 * * * *";

// Hour
export const EVERY_ONE_HOUR = "0 0 * * * *";
export const EVERY_ONE_HOUR_AT_SEC_30 = "30 0 * * * *";
export const EVERY_ONE_HOUR_AT_MIN_30 = "0 30 * * * *";
export const EVERY_THREE_HOURS = "0 0 */3 * * *";
export const EVERY_SIX_HOURS = "0 0 */6 * * *";
export const EVERY_SIX_HOURS_2 = "0 0 5,11,17,23 * * *";

// Day
export const EVERYDAY = "0 0 0 * * *";

export const retryUntilSuccess = async (fn, time = 3) => {
  let tryNum = 0;
  while (tryNum < time) {
    try {
      await fn();
      break;
    } catch (e) {
      console.info(e?.message);
      logToInternalDiscord("Exception!!");
      logToInternalDiscord(e?.message);
      tryNum++;
      delayInSecond(3);
    }
  }
};

export const logToInternalDiscord = async (message) => {
  try {
    if (!process.env.DISCORD_INTERNAL_WEBHOOK_URL) return;
    const discordWebHookUrl = process.env.DISCORD_INTERNAL_WEBHOOK_URL;
    if (!discordWebHookUrl) {
      throw new Error("No Discord Webhook URL found");
    }
    console.info(message);
    await axios.post(discordWebHookUrl, {
      content: message,
    });
  } catch (error) {
    console.error(error);
  }
};

export const logToPublicDiscord = async (message) => {
  try {
    if (!process.env.DISCORD_PUBLIC_WEBHOOK_URL) return;
    const discordWebHookUrl = process.env.DISCORD_PUBLIC_WEBHOOK_URL;
    if (!discordWebHookUrl) {
      throw new Error("No Public Discord Webhook URL found");
    }
    console.info(message);
    await axios.post(discordWebHookUrl, {
      content: message,
    });
  } catch (error) {
    console.error(error);
  }
};
