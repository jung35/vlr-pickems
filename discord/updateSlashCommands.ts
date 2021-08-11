import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";
import * as winston from "winston";

const CLIENT_ID = process.env.CLIENT_ID as string;

const slash_command = new SlashCommandBuilder().setName("update-slash-command").setDescription("Nahnahnahnah");
const stats_command = new SlashCommandBuilder().setName("stats").setDescription("List user stats");
const update_command = new SlashCommandBuilder().setName("update").setDescription("Update points");
const use_command = new SlashCommandBuilder()
  .setName("use")
  .setDescription("See or select config to use")
  .addStringOption((option) =>
    option.setName("config").setDescription("Change the config being used").setRequired(false)
  );
const config_command = new SlashCommandBuilder().setName("config").setDescription("What does this do");

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

export default async function updateSlashCommands(): Promise<boolean> {
  try {
    winston.info("Started refreshing application (/) commands.");

    // await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID as string), {
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: [stats_command, update_command, use_command, config_command, slash_command],
    });

    winston.info("Successfully reloaded application (/) commands.");

    return true;
  } catch (error) {
    winston.error(error);

    return false;
  }
}
