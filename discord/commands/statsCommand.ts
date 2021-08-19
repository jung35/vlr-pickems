import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getStats, statsToString } from "../stats";

export const slash_command = new SlashCommandBuilder()
  .setName("stats")
  .setDescription("List user stats");

export default async function statsCommand(
  interaction: CommandInteraction
): Promise<void> {
  interaction.reply(statsToString(await getStats()));
}
