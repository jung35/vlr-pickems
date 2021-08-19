import { Interaction, Permissions } from "discord.js";

const jung_id = "119923417892913154";

export default function checkAdmin(interaction: Interaction): boolean {
  const user = interaction.user;

  if (user.id === jung_id) {
    return true;
  }

  return (interaction.member?.permissions as Readonly<Permissions>).has(Permissions.FLAGS.ADMINISTRATOR);
}
