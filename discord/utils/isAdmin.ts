import { BaseCommandInteraction, MessageComponentInteraction, Permissions } from "discord.js";
import * as winston from "winston";

const jung_id = "119923417892913154";

export default async function isAdmin(
  interaction: MessageComponentInteraction | BaseCommandInteraction
): Promise<boolean> {
  const user = interaction.user;

  if (user.id === jung_id) {
    return true;
  }

  const is_admin = (interaction.member?.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR);

  if (!is_admin) {
    winston.info("User does not have permission");
    await interaction.reply({ content: "You have no permission", ephemeral: true });
  }

  return is_admin;
}
