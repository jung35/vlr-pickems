/// <reference path="../../support/index.d.ts" />

import getBracket from "../../support/getBracket";
import { LiveBracketInfo } from "../../../discord/types";

describe("Tourney Pickems page", () => {
  it("It gets original match-ups", () => {
    cy.visit(Cypress.env("pickem_url"));

    const bracket: LiveBracketInfo[] = [];

    cy.get(".bracket-item.mod-pickem")
      .each((match_el, i) => {
        const match_object = getBracket(match_el, "original") as LiveBracketInfo;

        cy.log(`LiveBracket Match #${i} ${match_object.teams}`);
        cy.log(`LiveBracket id ${match_object.id}, ${match_object.next}`);
        cy.log(`LiveBracket Winner ${match_object.winner}`);

        bracket.push(match_object);
      })
      .then(() => {
        cy.saveBracket("../original", bracket);
      });
  });
});
