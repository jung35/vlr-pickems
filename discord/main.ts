import dotenv from "dotenv";
dotenv.config();

import Discord from "discord.js";
import { getSettings, updateSettings } from "./settings";
import { getStats, statsToString } from "./stats";
import { runCypress } from "./cypress";

const client = new Discord.Client();

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", async (message) => {
  if (!message.guild) {
    return;
  }

  const member = message.member;
  const user = member?.user;
  const args = message.content.split(" ");

  const is_admin = user && !user.bot && member?.hasPermission("ADMINISTRATOR");
  const settings = await getSettings();

  switch (args[0].toLowerCase()) {
    case "/stats":
      message.channel.send(statsToString(await getStats()));
      break;
    case "/update":
      if (!is_admin) {
        return;
      }

      message.reply("Running updater");

      try {
        await runCypress();
        message.reply("Updated successfully");
      } catch (error) {
        message.reply("There was an error trying to update");
      }

      break;
    case "/use":
      if (!is_admin) {
        return;
      }

      if (args.length === 1) {
        message.reply(`Using: ${settings.use}`);
      } else {
        // i hate me for using switch case with linting a little bit
        message.reply(`Using: ${(await updateSettings("use", args[1])).use}`);
      }

      break;
    case "/config":
      if (!is_admin) {
        return;
      }

      // just do this manually why build command for it wtf
      switch (args[1].toLowerCase()) {
        case "create":
        case "update":
        case "add-user":
        case "delete-user":
          message.reply("u thot");
      }

      break;
  }
});

client.login(process.env.DISCORD_TOKEN);
