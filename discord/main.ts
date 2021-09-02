import dotenv from "dotenv";
dotenv.config();
import "./logger";
import * as winston from "winston";

import { Client, CommandInteractionOption, Intents } from "discord.js";
import useCommand, { slash_command as use_command } from "./commands/useCommand";
import statsCommand, { slash_command as stats_command } from "./commands/statsCommand";
import updateCommand, { slash_command as update_command } from "./commands/updateCommand";
import configCommand, { slash_command as config_command } from "./commands/configCommand";
import slashCommand, { updateSlashCommands, slash_command } from "./commands/slashCommand";
import addUserCommand, { slash_command as add_user_command } from "./commands/addUserCommand";
import { getSettings } from "./settings";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const jung = "119923417892913154";
const UPDATE_SLASH_ON_START = process.env.UPDATE_SLASH_ON_START === "true";
const UPDATE_GUILD_SLASH = process.env.UPDATE_GUILD_SLASH === "true";

client.on("ready", async () => {
  winston.info(`Discord bot ready: ${client.user?.tag}`);

  try {
    const jung_user = await client.users.fetch(jung);
    winston.info("Found admin user to send DM to");
    const dm_channel = await jung_user.createDM();

    await dm_channel.send(`Discord bot ready`);

    if (UPDATE_SLASH_ON_START) {
      const status = await updateSlashCommands();

      if (status) {
        dm_channel.send(`Slash command update ${UPDATE_GUILD_SLASH ? "to guild " : ""}success`);
      } else {
        dm_channel.send(`Slash command update ${UPDATE_GUILD_SLASH ? "to guild " : ""}failed`);
      }
    }

    const settings = await getSettings();
    dm_channel.send(`Loaded with settings:\`\`\`
${JSON.stringify(settings, null, 2)}
\`\`\``);
  } catch (error) {
    winston.info("Could not find admin user to send DM to");
  }
});

client.on("interactionCreate", async (interaction) => {
  const user = interaction.user;

  if (interaction.isCommand()) {
    const options = interaction.options;
    winston.info(`@${user.username}: ${interaction.commandName} ${options.data.map(joinValue).join(" ")}`);

    if (interaction.commandName === stats_command.name) {
      await statsCommand(interaction);
    } else if (interaction.commandName === update_command.name) {
      await updateCommand(interaction);
    } else if (interaction.commandName === use_command.name) {
      await useCommand(interaction);
    } else if (interaction.commandName === config_command.name) {
      await configCommand(interaction);
    } else if (interaction.commandName === slash_command.name) {
      await slashCommand(interaction);
    } else if (interaction.commandName === add_user_command.name) {
      await addUserCommand(interaction);
    }

    if (!interaction.replied) {
      await interaction.reply({ content: "Something went wrong", ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

function joinValue(option: CommandInteractionOption) {
  return option.value;
}
