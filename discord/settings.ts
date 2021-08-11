import fs from "fs/promises";
import { AppSettings } from "./types";
import * as winston from "winston";

const filename = "dist/settings.json";

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw_settings = await fs.readFile(filename, "utf-8");
    winston.info("getSettings: SUCCESS");

    return JSON.parse(raw_settings);
  } catch (error) {
    winston.error("getSettings: ERROR", error);

    await fs.writeFile(filename, JSON.stringify(default_settings));

    return default_settings;
  }
}

// Imagine reading file everytime we wanna change key value
// File storages are the best. No one can change my mind
export async function updateSettings(key: keyof AppSettings, value: string): Promise<AppSettings> {
  const settings = await getSettings();
  const old_value: undefined | string = settings[key];
  settings[key] = value;

  try {
    await fs.writeFile(filename, JSON.stringify(settings));
    winston.info(`updateSettings: SUCCESS [${key}] => ${value}`);
  } catch (error) {
    settings[key] = old_value;
    winston.error("updateSettings: ERROR", error);
  }

  return settings;
}

const default_settings = { use: "example" };
