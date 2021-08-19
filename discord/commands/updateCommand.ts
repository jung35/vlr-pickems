import { CommandInteraction } from "discord.js";
import * as winston from "winston";
import checkAdmin from "../utils/checkAdmin";
import cypress from "cypress";
import { getSettings } from "../settings";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CypressUpdateType } from "../types";

export const slash_command = new SlashCommandBuilder()
  .setName("update")
  .setDescription("Update points")
  .addStringOption((option) =>
    option
      .setName("action")
      .setDescription("What should the bot update?")
      .setRequired(true)
      .addChoice("All", "all")
      .addChoice("Teams List", "teams")
      .addChoice("Total Points (Only updates points)", "points")
      .addChoice("Pickem Brackets (Does not update points)", "pickems")
  );

let update_promise: null | Promise<
  | CypressCommandLine.CypressRunResult
  | CypressCommandLine.CypressFailedRunResult
> = null;

export default async function updateCommand(
  interaction: CommandInteraction
): Promise<void> {
  const is_admin = checkAdmin(interaction);
  if (!is_admin) {
    cy.log("User does not have permission");
    interaction.reply({ content: "You have no permission", ephemeral: true });

    return;
  }

  const action = interaction.options.getString(
    "action"
  ) as null | CypressUpdateType;

  if (!action) {
    cy.log("No action found");

    return;
  }

  cy.log(`Updating cypress with: ${action}`);

  await interaction.deferReply({ ephemeral: true });

  try {
    await runCypress(action);
    await interaction.editReply({ content: `Updated ${action} successfully` });
  } catch (error) {
    if (error === "already running") {
      await interaction.editReply({
        content: "Try again after previous update command is finished",
      });
    } else {
      await interaction.editReply({
        content: "There was an error trying to update",
      });
    }
  }
}

export async function runCypress(action: CypressUpdateType): Promise<void> {
  const settings = await getSettings();

  if (update_promise) {
    cy.log("Cypress already running");

    throw "already running";
  }

  cy.log("Running Cypress");

  const cypress_config: Partial<CypressCommandLine.CypressRunOptions> = {
    configFile: `./config/${settings.use}.json`,
    quiet: true,
  };

  if (action === "teams") {
    cypress_config.spec = "./cypress/integration/TeamsList.ts";
  } else if (action === "pickems") {
    cypress_config.spec = "./cypress/integration/UserBrackets.ts";
  } else if (action === "points") {
    cypress_config.spec = "./cypress/integration/LiveBracket.ts";
  }

  update_promise = cypress.run(cypress_config);

  const result = await update_promise;

  update_promise = null;

  if ("failures" in result) {
    cy.log("Cypress Failed");

    throw null;
  }

  cy.log("Cypress Successful");
}
