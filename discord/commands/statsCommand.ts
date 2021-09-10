import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import getPickemStatsToString from "../utils/getPickemStatsToString";
import getPickemStats from "../utils/getPickemStats";
import { MessageEmbed } from "discord.js";

export const slash_command = new SlashCommandBuilder().setName("stats").setDescription("List user stats");

export default async function statsCommand(interaction: CommandInteraction): Promise<void> {
  const pickem_stats = await getPickemStats();
  const stats_string = getPickemStatsToString(pickem_stats);
  const embed_message = new MessageEmbed()
    .setColor("#80D8FF")
    .setTitle("Pickem stats")
    .addField("\u200b", stats_string);

  await interaction.reply({ embeds: [embed_message] });
}
