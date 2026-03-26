const TEST_EMAIL = `cypress_tickets_${Date.now()}@test.com`;
const TEST_PASSWORD = "Password123!";
const TEST_NAME = "Cypress Tickets User";

describe("Tickets Flow - Unauthenticated", () => {
  it("should redirect /profile to login when not logged in", () => {
    cy.visit("/profile");
    cy.url({ timeout: 10000 }).should("include", "/auth/login");
  });

  it("should redirect /profile/tickets to login when not logged in", () => {
    cy.visit("/profile/tickets");
    cy.url({ timeout: 10000 }).should("include", "/auth/login");
  });
});

describe("Tickets Flow - Authenticated", () => {
  before(() => {
    cy.registerTestUser(TEST_EMAIL, TEST_PASSWORD, TEST_NAME);
  });

  beforeEach(() => {
    cy.visit("/auth/login");
    cy.loginTestUser(TEST_EMAIL, TEST_PASSWORD);
  });

  it("should show the profile page with user info", () => {
    cy.visit("/profile");
    cy.contains(TEST_NAME, { timeout: 10000 }).should("be.visible");
    cy.contains(TEST_EMAIL).should("be.visible");
  });

  it("should show the tickets page", () => {
    cy.visit("/profile/tickets");
    cy.contains("My Tickets", { timeout: 10000 }).should("be.visible");
  });

  it("should show 'No tickets found' when user has no tickets", () => {
    cy.visit("/profile/tickets");
    cy.contains("No tickets found", { timeout: 10000 }).should("be.visible");
  });
});
