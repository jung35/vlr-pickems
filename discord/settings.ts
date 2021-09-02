import fs from "fs/promises";
import { AppSettings } from "./types";
import * as winston from "winston";

const filename = "dist/settings.json";

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw_settings = await fs.readFile(filename, "utf-8");
    winston.info("getSettings: SUCCESS");

    return { ...default_settings, ...(JSON.parse(raw_settings) as AppSettings) };
  } catch (error) {
    winston.error("getSettings: ERROR", error);

    await fs.writeFile(filename, JSON.stringify(default_settings, null, 2));

    return default_settings;
  }
}

// Imagine reading file everytime we wanna change key value
// File storages are the best. No one can change my mind
export async function updateSettings(key: keyof AppSettings, value: unknown): Promise<AppSettings> {
  let settings = await getSettings();
  const old_value = settings[key];
  settings = { ...settings, [key]: value };

  try {
    await fs.writeFile(filename, JSON.stringify(settings, null, 2));
    winston.info(`updateSettings: SUCCESS [${key}] => ${value}`);
  } catch (error) {
    settings = { ...settings, [key]: old_value };
    winston.error("updateSettings: ERROR", error);
  }

  return settings as AppSettings;
}

const default_settings: AppSettings = {
  use: "example",
  config_dir: "config/",
  data_dir: "pickems_data/",
  allow_add_user: false,
};
