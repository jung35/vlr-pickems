import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import * as winston from "winston";
import checkAdmin from "../utils/checkAdmin";

import { slash_command as stats_command } from "./statsCommand";
import { slash_command as update_command } from "./updateCommand";
import { slash_command as use_command } from "./useCommand";
import { slash_command as config_command } from "./configCommand";
export const slash_command = new SlashCommandBuilder()
  .setName("update-slash-command")
  .setDescription("Nahnahnahnah");

export default async function slashCommand(
  interaction: CommandInteraction
): Promise<void> {
  const is_admin = checkAdmin(interaction);

  if (!is_admin) {
    cy.log("User does not have permission");
    interaction.reply({ content: "You have no permission", ephemeral: true });

    return;
  }

  const status = await updateSlashCommands();

  if (status) {
    interaction.reply("Slash command update success");
  } else {
    interaction.reply("Slash command update failed");
  }
}

// prevent circular dependency
const CLIENT_ID = process.env.CLIENT_ID as string;
const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

export async function updateSlashCommands(): Promise<boolean> {
  try {
    cy.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        CLIENT_ID,
        process.env.GUILD_ID as string
      ),
      {
        // await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: [
          stats_command,
          update_command,
          use_command,
          config_command,
          slash_command,
        ],
      }
    );

    cy.log("Successfully reloaded application (/) commands.");

    return true;
  } catch (error) {
    winston.error(error);

    return false;
  }
}
