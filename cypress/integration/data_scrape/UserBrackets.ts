/// <reference path="../../support/index.d.ts" />

import getBracket from "../../support/getBracket";
import { UserPickemInfo, UserPickemBracketInfo } from "../../../discord/types";

describe("User Brackets", () => {
  it("clears out player bracket folder", () => {
    cy.clearPlayerBrackets();
  });

  const pickems: UserPickemInfo[] = Cypress.env("pickems");

  pickems.map((pickem) => {
    it(`Get pickem created by ${pickem.user}`, () => {
      cy.visit(pickem.url);

      const bracket: UserPickemBracketInfo[] = [];

      cy.get(".bracket-item.mod-pickem")
        .each((match_el, i) => {
          const match_object: UserPickemBracketInfo = getBracket(match_el);

          cy.log(`UserBrackets Match #${i} match_object.teams`);
          cy.log(`UserBrackets id ${match_object.id}, ${match_object.next}`);
          cy.log(`UserBrackets Prediction: ${match_object.winner}`);

          bracket.push(match_object);
        })
        .then(() => {
          cy.saveBracket(pickem.user, bracket);
        });
    });
  });
});
