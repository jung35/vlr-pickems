import fs from "fs/promises";
import { AppSettings } from "./types";

const filename = "dist/settings.json";

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw_settings = await fs.readFile(filename, "utf-8");

    return JSON.parse(raw_settings);
  } catch (error) {
    await fs.writeFile(filename, JSON.stringify(default_settings));

    return default_settings;
  }
}

// Imagine reading file everytime we wanna change key value
// File storages are the best. No one can change my mind
export async function updateSettings(key: keyof AppSettings, value: string): Promise<AppSettings> {
  const settings = await getSettings();
  settings[key] = value;

  await fs.writeFile(filename, JSON.stringify(settings));

  return settings;
}

const default_settings = {
  use: "example",
};
