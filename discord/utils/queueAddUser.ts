import fs from "fs/promises";
import { getSettings } from "../settings";
import { CypressConfigFile, UserPickemInfo } from "../types";
import * as winston from "winston";

let queue_pickems: UserPickemInfo[] = [];
let file_promise: null | Promise<string | void>;

export default async function queueAddUser(user_pickem?: UserPickemInfo): Promise<void> {
  if (user_pickem) {
    queue_pickems.push(user_pickem);
  }

  if (file_promise || queue_pickems.length === 0) {
    return;
  }

  const settings = await getSettings();
  const config_file = settings.config_dir + settings.use + ".json";

  const to_add = [...queue_pickems];
  queue_pickems = [];

  try {
    file_promise = fs.readFile(config_file, "utf-8");

    const raw_config_data = (await file_promise) as string;
    const config_data: CypressConfigFile = JSON.parse(raw_config_data);

    for (let i = 0; i < to_add.length; i++) {
      winston.info(`queueAddUser: Inserting user ${to_add[i].user} (${to_add[i].user_id}): ${to_add[i].url}`);
      insertUserInfo(config_data, to_add[i]);
    }

    file_promise = fs.writeFile(config_file, JSON.stringify(config_data, null, 2));
    winston.info("queueAddUser: SUCESS");

    await file_promise;
  } catch (error) {
    winston.error("queueAddUser: ERROR", error);

    throw "why";
  }

  file_promise = null;

  if (queue_pickems.length > 0) {
    queueAddUser();
  }
}

export async function deleteUser(user_id: string): Promise<void> {
  if (file_promise) {
    throw "wait";
  }

  const settings = await getSettings();
  const config_file = settings.config_dir + settings.use + ".json";

  try {
    file_promise = fs.readFile(config_file, "utf-8");

    const raw_config_data = (await file_promise) as string;
    const config_data: CypressConfigFile = JSON.parse(raw_config_data);

    const index = config_data.env.pickems.findIndex(findByUserId(user_id));

    if (index === -1) {
      throw "not found";
    }

    config_data.env.pickems.splice(index, 1);

    file_promise = fs.writeFile(config_file, JSON.stringify(config_data, null, 2));
    winston.info("queueAddUser: SUCESS");

    await file_promise;
  } catch (error) {
    winston.error("queueAddUser: ERROR", error);

    throw error;
  }

  file_promise = null;

  if (queue_pickems.length > 0) {
    queueAddUser();
  }
}

function insertUserInfo(config_data: CypressConfigFile, user_pickem: UserPickemInfo): void {
  const index = config_data.env.pickems.findIndex(findByUserId(user_pickem.user_id));

  if (index === -1) {
    config_data.env.pickems.push(user_pickem);
  } else {
    config_data.env.pickems[index] = user_pickem;
  }
}

function findByUserId(user_id: string) {
  return function (config_user_pickem: UserPickemInfo) {
    return config_user_pickem.user_id === user_id;
  };
}
