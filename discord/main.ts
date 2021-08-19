import dotenv from "dotenv";
dotenv.config();
import "./logger";
import * as winston from "winston";

import { Client, Intents } from "discord.js";
import useCommand, {
  slash_command as use_command,
} from "./commands/useCommand";
import statsCommand, {
  slash_command as stats_command,
} from "./commands/statsCommand";
import updateCommand, {
  slash_command as update_command,
} from "./commands/updateCommand";
import configCommand, {
  slash_command as config_command,
} from "./commands/configCommand";
import slashCommand, {
  updateSlashCommands,
  slash_command,
} from "./commands/slashCommand";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const jung = "119923417892913154";
const UPDATE_SLASH = process.env.UPDATE_SLASH === "true";

client.on("ready", async () => {
  winston.info(`Discord bot ready: ${client.user?.tag}`);

  try {
    const jung_user = await client.users.fetch(jung);
    winston.info("Found admin user to send DM to");
    const dm_channel = await jung_user.createDM();

    dm_channel.send(`Discord bot ready`);

    if (UPDATE_SLASH) {
      const status = await updateSlashCommands();

      if (status) {
        dm_channel.send(`Slash command update success`);
      } else {
        dm_channel.send("Slash command update failed");
      }
    }
  } catch (error) {
    winston.info("Could not find admin user to send DM to");
  }
});

client.on("interactionCreate", async (interaction) => {
  const user = interaction.user;

  if (!interaction.isCommand()) {
    return;
  }

  if (!interaction.inGuild() && user.id !== jung) {
    winston.info("User has no permission to send private message");
    interaction.reply({ content: "You have no permission", ephemeral: true });

    return;
  }

  const options = interaction.options;

  winston.info(
    `@${user?.username}: ${interaction.commandName} ${options.data.join(" ")}`
  );

  if (interaction.commandName === stats_command.name) {
    statsCommand(interaction);
  } else if (interaction.commandName === update_command.name) {
    updateCommand(interaction);
  } else if (interaction.commandName === use_command.name) {
    useCommand(interaction);
  } else if (interaction.commandName === config_command.name) {
    configCommand(interaction);
  } else if (interaction.commandName === slash_command.name) {
    slashCommand(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);
