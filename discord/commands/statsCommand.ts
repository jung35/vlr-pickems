import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import getPickemStatsToString from "../utils/getPickemStatsToString";
import getPickemStats from "../utils/getPickemStats";

export const slash_command = new SlashCommandBuilder().setName("stats").setDescription("List user stats");

export default async function statsCommand(interaction: CommandInteraction): Promise<void> {
  const pickem_stats = await getPickemStats();

  await interaction.reply(getPickemStatsToString(pickem_stats));
}
