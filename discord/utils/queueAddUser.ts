import { CypressConfigFile, UserPickemInfo } from "../types";
import * as winston from "winston";
import { cypress_config_write_promise, getCypressConfig, updateCypressConfig } from "./updateCypressConfig";

let queue_pickems: Partial<UserPickemInfo>[] = [];

export default async function queueAddUser(user_pickem?: Partial<UserPickemInfo>): Promise<void> {
  if (user_pickem) {
    queue_pickems.push(user_pickem);
  }

  if (queue_pickems.length === 0) {
    return;
  }

  const to_add = [...queue_pickems];
  queue_pickems = [];

  try {
    const config_data: CypressConfigFile = await getCypressConfig();

    for (let i = 0; i < to_add.length; i++) {
      winston.info(`queueAddUser: Inserting user ${to_add[i].user} (${to_add[i].user_id}): ${to_add[i].url}`);
      insertUserInfo(config_data, to_add[i]);
    }

    await updateCypressConfig({ ...config_data });

    winston.info("queueAddUser: SUCESS");
  } catch (error) {
    if (cypress_config_write_promise) {
      queue_pickems = queue_pickems.concat(to_add);
      await cypress_config_write_promise;
    } else {
      winston.error("queueAddUser: ERROR", error);
      throw "why";
    }
  }

  if (queue_pickems.length > 0) {
    queueAddUser();
  }
}

export async function getAllUserPickemInfo(): Promise<UserPickemInfo[]> {
  try {
    const config_data: CypressConfigFile = await getCypressConfig();

    return config_data.env.pickems;
  } catch (error) {
    throw "error getting config file";
  }
}

export async function getUserPickemInfo(user_name: string): Promise<undefined | UserPickemInfo> {
  try {
    const config_data: CypressConfigFile = await getCypressConfig();

    return config_data.env.pickems.find(findByUserName(user_name));
  } catch (error) {
    throw "error getting config file";
  }
}

export async function deleteUser(user_id: string): Promise<void> {
  try {
    const config_data: CypressConfigFile = await getCypressConfig();

    const index = config_data.env.pickems.findIndex(findByUserId(user_id));

    if (index === -1) {
      throw "not found";
    }

    config_data.env.pickems.splice(index, 1);

    await updateCypressConfig({ ...config_data });
    winston.info("queueAddUser: SUCESS");
  } catch (error) {
    if (cypress_config_write_promise) {
      await cypress_config_write_promise;
      await deleteUser(user_id);
    } else {
      winston.error("deleteUser: ERROR", error);
      throw error;
    }
  }

  if (queue_pickems.length > 0) {
    queueAddUser();
  }
}

function insertUserInfo(config_data: CypressConfigFile, user_pickem: Partial<UserPickemInfo>): void {
  if (!user_pickem.user_id) {
    return;
  }

  const index = config_data.env.pickems.findIndex(findByUserId(user_pickem.user_id));

  if (index === -1) {
    config_data.env.pickems.push(user_pickem as UserPickemInfo);
  } else {
    const old_pickem_info = config_data.env.pickems[index];
    config_data.env.pickems[index] = { ...old_pickem_info, ...user_pickem };
  }
}

function findByUserId(user_id: string) {
  return function (config_user_pickem: UserPickemInfo) {
    return config_user_pickem.user_id === user_id;
  };
}

export function findByUserName(user_name: string) {
  return function (config_user_pickem: UserPickemInfo): boolean {
    return config_user_pickem.user === user_name;
  };
}
