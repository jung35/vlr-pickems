import getBracket from "../support/getBracket";
import * as winston from "winston";

describe("Tourney Pickem pages", () => {
  const pickems = Cypress.env("pickems");

  pickems.map((pickem) => {
    it(`Get pickem created by ${pickem.user}`, () => {
      cy.visit(pickem.url);

      const bracket = [];

      cy.get(".bracket-item.mod-pickem")
        .each((match_el, i) => {
          const match_object = getBracket(match_el);

          winston.info(`getPickems Match #${i} match_object.teams`);
          winston.info(`getPickems id ${match_object.id}, ${match_object.next}`);
          winston.info(`getPickems Prediction: ${match_object.winner}, Points ${match_object.points}`);

          bracket.push(match_object);
        })
        .then(() => {
          cy.saveBracket(pickem.user, bracket);
        });
    });
  });
});
