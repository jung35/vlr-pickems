import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getSettings } from "../settings";
import isAdmin from "../utils/isAdmin";
import * as winston from "winston";
import runCypress from "../utils/runCypress";
import queueAddUser from "../utils/queueAddUser";

export const slash_command = new SlashCommandBuilder()
  .setName("add")
  .setDescription("Add yourself to the pickem list")
  .addStringOption((option) => option.setName("pickem").setDescription("URL of your pickem").setRequired(true));

const pickem_url_reg = /^(https:\/\/|)(www.|)vlr.gg\/pickem\/(.[^-\\/]*)$/;

export default async function addUserCommand(interaction: CommandInteraction): Promise<void> {
  const settings = await getSettings();
  const user = interaction.user;

  if (!settings.allow_add_user && !(await isAdmin(interaction))) {
    return;
  }

  const pickem_url = interaction.options.getString("pickem");
  const invalid_message = `Invalid pickem url\n\`\`\`${pickem_url}\`\`\`Please check again. Make sure it's a similar url like: \`https://www.vlr.gg/pickem/asd123fgh\``;

  if (!pickem_url) {
    winston.info("User missing pickem url");
    await interaction.reply({ content: "Please enter in the pickem url", ephemeral: true });

    return;
  }

  if (!pickem_url.match(pickem_url_reg)) {
    winston.info(`Invalid pickem url: ${pickem_url}`);
    await interaction.reply({ content: invalid_message, ephemeral: true });

    return;
  }

  winston.info(`Attempting to validate user's pickem: ${pickem_url}`);
  await interaction.deferReply({ ephemeral: true });

  try {
    await runCypress("validate-pickem", { user_entered_url: pickem_url });
  } catch (error) {
    winston.info(`ERROR: ${error}`);

    if (error === "already running") {
      await interaction.editReply({ content: "Process is busy. There is no multitask here." });
    } else {
      await interaction.editReply({ content: invalid_message });
    }

    return;
  }

  const pickem_data = { user_id: user.id, user: user.username, url: pickem_url, updated_at: new Date().toString() };
  winston.info(`Adding user's pickem to config`, pickem_data);

  try {
    await queueAddUser(pickem_data);
    await interaction.editReply({ content: "now to do some buttons" });
  } catch (error) {
    await interaction.editReply({ content: "There was an error adding your pickems" });
  }
}
