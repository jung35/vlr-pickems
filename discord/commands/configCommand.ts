import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import * as winston from "winston";
import isAdmin from "../utils/isAdmin";
import { deleteUser } from "../utils/queueAddUser";

export const slash_command = new SlashCommandBuilder()
  .setName("config")
  .setDescription("What does this do")
  .addSubcommandGroup((subcommand_group) =>
    subcommand_group
      .setName("user")
      .setDescription("Configure users in the pickem config")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("delete")
          .setDescription("Enter in user id you want to delete")
          .addUserOption((option) =>
            option.setName("target").setDescription("User to remove from config").setRequired(true)
          )
      )
  );

export default async function configCommand(interaction: CommandInteraction): Promise<void> {
  if (!(await isAdmin(interaction))) {
    return;
  }

  if (interaction.options.getSubcommandGroup() === "user") {
    if (interaction.options.getSubcommand() === "delete") {
      const target = interaction.options.getUser("target");

      if (!target) {
        await interaction.reply("You need to select user to delete from the config");

        return;
      }

      winston.info(`Deleting user from config: ${target.username} (${target.id})`);
      await interaction.deferReply({ ephemeral: true });

      try {
        await deleteUser(target.id);

        winston.info(`Delete success`);
        await interaction.editReply(`Removed user from config: ${target.username} (${target.id})`);
      } catch (error) {
        winston.info(`Delete error: ${error}`);
        await interaction.editReply(`Could not remove user from config`);
      }
    }
  }
}
