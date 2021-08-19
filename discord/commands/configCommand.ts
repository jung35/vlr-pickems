import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import * as winston from "winston";
import checkAdmin from "../utils/checkAdmin";

export const slash_command = new SlashCommandBuilder()
  .setName("config")
  .setDescription("What does this do");

export default async function configCommand(
  interaction: CommandInteraction
): Promise<void> {
  const is_admin = checkAdmin(interaction);

  if (!is_admin) {
    winston.info("User does not have permission");
    interaction.reply({ content: "You have no permission", ephemeral: true });

    return;
  }
}
