import { CommandInteraction } from "discord.js";
import * as winston from "winston";
import isAdmin from "../utils/isAdmin";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CypressUpdateType } from "../types";
import runCypress from "../utils/runCypress";

export const slash_command = new SlashCommandBuilder()
  .setName("update")
  .setDescription("Update points")
  .addStringOption((option) =>
    option
      .setName("action")
      .setDescription("What should the bot update?")
      .setRequired(true)
      .addChoice("All", "all")
      .addChoice("Team List", "teams")
      .addChoice("Total Points (Only updates points)", "points")
      .addChoice("Pickem Brackets (Does not update points)", "pickems")
  );

export default async function updateCommand(interaction: CommandInteraction): Promise<void> {
  if (!(await isAdmin(interaction))) {
    return;
  }

  const action = interaction.options.getString("action") as null | CypressUpdateType;

  if (!action) {
    winston.info("No action found");

    return;
  }

  winston.info(`Updating cypress with: ${action}`);
  await interaction.deferReply({ ephemeral: true });

  try {
    await runCypress(action);
    await interaction.editReply({ content: `Updated ${action} successfully` });
  } catch (error) {
    if (error === "already running") {
      await interaction.editReply({ content: "Try again after previous update command is finished" });
    } else {
      await interaction.editReply({ content: "There was an error trying to update" });
    }
  }
}
