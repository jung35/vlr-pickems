import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import * as winston from "winston";
import isAdmin from "../utils/isAdmin";
import queueAddUser, { deleteUser } from "../utils/queueAddUser";

const GUILD_ID = process.env.GUILD_ID as string;
const CHANNEL_ID = process.env.CHANNEL_ID as string;

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
          .setDescription("Select pickem you want to delete")
          .addUserOption((option) => option.setName("target").setDescription("Select user").setRequired(true))
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("paid")
          .setDescription("Set user as paid")
          .addUserOption((option) => option.setName("target").setDescription("Select user").setRequired(true))
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("unpaid")
          .setDescription("Set user as unpaid")
          .addUserOption((option) => option.setName("target").setDescription("Select user").setRequired(true))
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
        await interaction.reply("You need to select a user");

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
    } else if (interaction.options.getSubcommand() === "paid") {
      const target = interaction.options.getUser("target");

      if (!target) {
        await interaction.reply("You need to select a user");

        return;
      }

      winston.info(`Set user as paid: ${target.username} (${target.id})`);
      await interaction.deferReply({ ephemeral: true });

      try {
        await queueAddUser({ user_id: target.id, paid: true });

        winston.info(`Paid update success`);

        await interaction.editReply(`Updated user to paid: ${target.username} (${target.id})`);
      } catch (error) {
        winston.info(`Paid update error: ${error}`);
        await interaction.editReply(`Could not set user as paid`);

        return;
      }

      try {
        const guild = await interaction.client.guilds.fetch(GUILD_ID);
        const channel = await guild.channels.fetch(CHANNEL_ID);
        if (channel?.isText()) {
          channel.send(`${target.username} joined the buy in!`);
        }
      } catch (error) {
        winston.error("Could not find channel to message", error);
      }
    } else if (interaction.options.getSubcommand() === "unpaid") {
      const target = interaction.options.getUser("target");

      if (!target) {
        await interaction.reply("You need to select a user");

        return;
      }

      winston.info(`Set user as unpaid: ${target.username} (${target.id})`);
      await interaction.deferReply({ ephemeral: true });

      try {
        await queueAddUser({ user_id: target.id, paid: false });

        winston.info(`Paid update success`);

        await interaction.editReply(`Updated user to unpaid: ${target.username} (${target.id})`);
      } catch (error) {
        winston.info(`Unpaid update error: ${error}`);
        await interaction.editReply(`Could not set user as unpaid`);
      }
    }
  }
}
