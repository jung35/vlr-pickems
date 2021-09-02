import { CypressConfigFile } from "../types";
import { getSettings } from "../settings";
import * as winston from "winston";
import fs from "fs/promises";

type CypressConfigBusyProcess<type> = null | Promise<type>;

export let cypress_config_write_promise: CypressConfigBusyProcess<void> = null;
export let cypress_config_read_promise: CypressConfigBusyProcess<string> = null;

export async function getCypressConfig(): Promise<CypressConfigFile> {
  if (cypress_config_write_promise) {
    await cypress_config_write_promise;
  }

  if (cypress_config_read_promise) {
    const raw_config_data = await cypress_config_read_promise;
    const config_data: CypressConfigFile = JSON.parse(raw_config_data);

    return config_data;
  }

  const settings = await getSettings();
  const config_file = settings.config_dir + settings.use + ".json";

  try {
    cypress_config_read_promise = fs.readFile(config_file, "utf-8");
    const raw_config_data = await cypress_config_read_promise;
    const config_data: CypressConfigFile = JSON.parse(raw_config_data);

    cypress_config_read_promise = null;

    return config_data;
  } catch (error) {
    winston.error("getCypressConfig: ERROR", error);
    cypress_config_read_promise = null;

    throw "error getting cypress config";
  }
}

export async function updateCypressConfig(new_config: CypressConfigFile): Promise<CypressConfigFile> {
  if (cypress_config_read_promise) {
    await cypress_config_read_promise;
  }

  if (cypress_config_write_promise) {
    throw "wait-write";
  }

  const settings = await getSettings();
  const config_file = settings.config_dir + settings.use + ".json";

  cypress_config_write_promise = fs.writeFile(config_file, JSON.stringify(new_config, null, 2));

  try {
    await cypress_config_write_promise;
    cypress_config_write_promise = null;

    return new_config;
  } catch (error) {
    winston.error("updateCypressConfig: ERROR", error);
    cypress_config_write_promise = null;

    throw "error-write";
  }
}
