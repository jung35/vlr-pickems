/// <reference path="../../support/index.d.ts" />

import getBracket from "../../support/getBracket";
import { UserPickemInfo, UserPickemBracketInfo, LiveBracketGroup } from "../../../discord/types";

describe("User Brackets", () => {
  it("clears out player bracket folder", () => {
    cy.clearPlayerBrackets();
  });

  const pickems: UserPickemInfo[] = Cypress.env("pickems");

  pickems.map((pickem) => {
    it(`Get pickem created by ${pickem.user}`, () => {
      cy.visit(pickem.url);

      const groups: LiveBracketGroup<UserPickemBracketInfo>[] = [];

      cy.get(".mod-bracket")
        .each(($group) => {
          const group_id = $group.find("div").get(3).getAttribute("id") as string;
          const brackets: UserPickemBracketInfo[] = [];

          cy.wrap($group)
            .get(".bracket-item.mod-pickem")
            .each((match_el, j) => {
              const match_object = getBracket(match_el) as UserPickemBracketInfo;

              cy.log(`UserBrackets Match #${j} match_object.teams`);
              cy.log(`UserBrackets id ${match_object.match_id}, ${match_object.next}`);
              cy.log(`UserBrackets Prediction: ${match_object.winner}`);

              brackets.push(match_object);
            });

          groups.push({ group_id, bracket_list: brackets });
        })
        .then(() => {
          cy.saveBracket(pickem.user, groups);
        });
    });
  });
});
