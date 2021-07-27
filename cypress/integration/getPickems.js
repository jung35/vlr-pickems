import getBracket from "../support/getBracket";

describe("Tourney Pickem pages", () => {
  const pickems = Cypress.env("pickems");

  pickems.map((pickem) => {
    it(`Get pickem created by ${pickem.user}`, () => {
      cy.visit(pickem.url);

      const bracket = [];

      cy.get(".bracket-item.mod-pickem")
        .each((match_el, i) => {
          const match_object = getBracket(match_el);

          cy.log(`Match #${i}`, match_object.teams);
          cy.log("id", match_object.id, match_object.next);
          cy.log(
            `Prediction`,
            match_object.winner,
            `Points`,
            match_object.points
          );

          bracket.push(match_object);
        })
        .then(() => {
          cy.saveBracket(pickem.user, bracket);
        });
    });
  });
});
