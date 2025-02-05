import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import * as winston from "winston";
import isAdmin from "../utils/isAdmin";

import { slash_command as stats_command } from "./statsCommand";
import { slash_command as update_command } from "./updateCommand";
import { slash_command as use_command } from "./useCommand";
import { slash_command as config_command } from "./configCommand";
export const slash_command = new SlashCommandBuilder().setName("update-slash-command").setDescription("Nahnahnahnah");
import { slash_command as add_user_command } from "./addUserCommand";

export default async function slashCommand(interaction: CommandInteraction): Promise<void> {
  if (!(await isAdmin(interaction))) {
    return;
  }

  const status = await updateSlashCommands();

  if (status) {
    await interaction.reply("Slash command update success");
  } else {
    await interaction.reply("Slash command update failed");
  }
}

// prevent circular dependency
const CLIENT_ID = process.env.CLIENT_ID as string;
const GUILD_ID = process.env.GUILD_ID as string;
const UPDATE_GUILD_SLASH = process.env.UPDATE_GUILD_SLASH === "true";
const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

const commands_list = [stats_command, add_user_command, update_command, use_command, config_command, slash_command];

export async function updateSlashCommands(): Promise<boolean> {
  let url: string = Routes.applicationCommands(CLIENT_ID);

  if (UPDATE_GUILD_SLASH) {
    url = Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID);
  }

  try {
    winston.info("Started refreshing application (/) commands.");

    await rest.put(url, { body: commands_list });

    winston.info("Successfully reloaded application (/) commands.");

    return true;
  } catch (error) {
    winston.error(error);

    return false;
  }
}
