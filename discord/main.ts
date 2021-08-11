import dotenv from "dotenv";
dotenv.config();
import "./logger";
import * as winston from "winston";

import { Client, Intents, Permissions } from "discord.js";
import { getSettings, updateSettings } from "./settings";
import { getStats, statsToString } from "./stats";
import { runCypress } from "./cypress";
import updateSlashCommands from "./updateSlashCommands";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const jung = "119923417892913154";

client.on("ready", async () => {
  winston.info(`Discord bot ready: ${client.user?.tag}`);

  const status = await updateSlashCommands();

  try {
    const jung_user = await client.users.fetch(jung);
    winston.info("Found admin user to send DM to");
    const dm_channel = await jung_user.createDM();

    dm_channel.send(`Discord bot ready`);

    if (status) {
      dm_channel.send(`Slash command update success`);
    } else {
      dm_channel.send("Slash command update failed");
    }
  } catch (error) {
    winston.info("Could not find admin user to send DM to");
  }
});

client.on("interactionCreate", async (interaction) => {
  const user = interaction.user;

  if (!interaction.isCommand() || (!interaction.inGuild() && user.id !== jung)) {
    return;
  }

  const options = interaction.options;

  const is_admin =
    user.id === jung || (interaction.member?.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR);
  const settings = await getSettings();

  winston.info(`@${user?.username}: ${interaction.commandName} ${options.data.join(" ")}`);

  if (interaction.commandName === "stats") {
    interaction.reply(statsToString(await getStats()));
  } else if (interaction.commandName === "update") {
    if (!is_admin) {
      winston.info("User has no permission to run this command");

      return;
    }
    await interaction.reply("Running updater");

    try {
      await runCypress();
      await interaction.editReply("Updated successfully");
    } catch (error) {
      await interaction.editReply("There was an error trying to update");
    }
  } else if (interaction.commandName === "use") {
    if (!is_admin) {
      winston.info("User has no permission to run this command");

      return;
    }

    const use_config = interaction.options.getString("config");

    if (!use_config) {
      interaction.reply(`Using: ${settings.use}`);
    } else {
      // i hate me for using switch case with linting a little bit
      interaction.reply(`Using: ${(await updateSettings("use", use_config)).use}`);
    }
  } else if (interaction.commandName === "config") {
    if (!is_admin) {
      winston.info("User has no permission to run this command");

      return;
    }
  } else if (interaction.commandName === "update-slash-command") {
    if (!is_admin) {
      winston.info("User has no permission to run this command");

      return;
    }

    const status = await updateSlashCommands();

    if (status) {
      interaction.reply("Slash command update success");
    } else {
      interaction.reply("Slash command update failed");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
