import * as winston from "winston";
import { CommandInteraction } from "discord.js";
import checkAdmin from "../utils/checkAdmin";
import { getSettings, updateSettings } from "../settings";
import { SlashCommandBuilder } from "@discordjs/builders";

export const slash_command = new SlashCommandBuilder()
  .setName("use")
  .setDescription("See or select config to use")
  .addStringOption((option) =>
    option.setName("config").setDescription("Change the config being used").setRequired(false)
  );

export default async function useCommand(interaction: CommandInteraction): Promise<void> {
  const is_admin = checkAdmin(interaction);

  if (!is_admin) {
    winston.info("User does not have permission");
    interaction.reply({ content: "You have no permission", ephemeral: true });

    return;
  }

  const settings = await getSettings();

  const use_config = interaction.options.getString("config");

  if (!use_config) {
    interaction.reply(`Using: ${settings.use}`);
  } else {
    const new_config = await updateSettings("use", use_config);
    interaction.reply(`Using: ${new_config.use}`);
  }
}
