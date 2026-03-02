describe("Smoke Tests", () => {
  it("should load homepage", () => {
    cy.visit("/");
    cy.contains("PassMaster").should("be.visible");
  });

  it("should load events page", () => {
    cy.visit("/event");
    cy.contains("Esdeveniments Actuals").should("be.visible");
  });

  it("should load admin page", () => {
    cy.visit("/admin");
    cy.contains("Esdeveniments Actuals").should("be.visible");
  });
});
