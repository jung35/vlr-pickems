/// <reference path="../../support/index.d.ts" />

import getBracket from "../../support/getBracket";
import { LiveBracketGroup, LiveBracketInfo } from "../../../discord/types";

describe("Tourney Pickems page", () => {
  it("It gets original match-ups", () => {
    cy.visit(Cypress.env("pickem_url"));

    const groups: LiveBracketGroup<LiveBracketInfo>[] = [];

    cy.get(".mod-bracket")
      .each(($group) => {
        const group_id = $group.find("div").get(2).getAttribute("id") as string;
        const brackets: LiveBracketInfo[] = [];

        cy.wrap($group)
          .get(".bracket-item.mod-pickem")
          .each((match_el, j) => {
            const match_object = getBracket(match_el, "original") as LiveBracketInfo;

            cy.log(`LiveBracket Match #${j} ${match_object.teams}`);
            cy.log(`LiveBracket id ${match_object.match_id}, ${match_object.next}`);
            cy.log(`LiveBracket Winner ${match_object.winner}`);

            brackets.push(match_object);
          });

        groups.push({ group_id, bracket_list: brackets });
      })
      .then(() => {
        cy.saveBracket<LiveBracketInfo>("../original", groups);
      });
  });
});
