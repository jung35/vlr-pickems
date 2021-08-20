describe("User Bracket Validation", () => {
  it("Attempts to validate user entered in correct url", () => {
    const user_entered_url = Cypress.env("user_entered_url");
    const original_pickem_url = new URL(Cypress.env("pickem_url"));

    cy.visit(user_entered_url);
    cy.get(".wf-title").find("a").should("have.attr", "href", original_pickem_url.pathname);
  });
});
