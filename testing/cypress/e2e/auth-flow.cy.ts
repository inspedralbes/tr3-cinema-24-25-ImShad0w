const TEST_EMAIL = `cypress_auth_${Date.now()}@test.com`;
const TEST_PASSWORD = "Password123!";
const TEST_NAME = "Cypress User";

describe("Auth Flow - Login Page", () => {
  beforeEach(() => {
    cy.visit("/auth/login");
  });

  it("should display the login form", () => {
    cy.contains("Sign in to your account").should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.contains("button", "Sign in").should("be.visible");
  });

  it("should display the Google login button", () => {
    cy.contains("Continuar amb Google").should("be.visible");
  });

  it("should display a link to the register page", () => {
    cy.contains("Don't have an account? Register").should("be.visible");
    cy.contains("Don't have an account? Register").click();
    cy.url().should("include", "/auth/register");
  });

  it("should show an error with invalid credentials", () => {
    cy.get('input[name="email"]').type("nonexistent@example.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.contains("button", "Sign in").click();
    cy.get(".bg-red-500, .text-red-500").should("be.visible");
  });

  it("should redirect to home after successful login", () => {
    cy.registerTestUser(TEST_EMAIL, TEST_PASSWORD, TEST_NAME);
    cy.get('input[name="email"]').type(TEST_EMAIL);
    cy.get('input[name="password"]').type(TEST_PASSWORD);
    cy.contains("button", "Sign in").click();
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");
  });
});

describe("Auth Flow - Register Page", () => {
  const REGISTER_EMAIL = `cypress_reg_${Date.now()}@test.com`;

  beforeEach(() => {
    cy.visit("/auth/register");
  });

  it("should display the register form", () => {
    cy.get('input[name="name"]').should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('input[name="password_confirmation"]').should("be.visible");
    cy.contains("button", "Register").should("be.visible");
  });

  it("should display the Google login button", () => {
    cy.contains("Continuar amb Google").should("be.visible");
  });

  it("should display a link to the login page", () => {
    cy.contains("Already have an account? Sign in").should("be.visible");
    cy.contains("Already have an account? Sign in").click();
    cy.url().should("include", "/auth/login");
  });

  it("should show an error when passwords do not match", () => {
    cy.get('input[name="name"]').type("Test User");
    cy.get('input[name="email"]').type(REGISTER_EMAIL);
    cy.get('input[name="password"]').type("Password123!");
    cy.get('input[name="password_confirmation"]').type("DifferentPassword!");
    cy.contains("button", "Register").click();
    cy.get(".bg-red-500, .text-red-500").should("be.visible");
  });

  it("should successfully register and redirect to home", () => {
    cy.get('input[name="name"]').type(TEST_NAME);
    cy.get('input[name="email"]').type(REGISTER_EMAIL);
    cy.get('input[name="password"]').type(TEST_PASSWORD);
    cy.get('input[name="password_confirmation"]').type(TEST_PASSWORD);
    cy.contains("button", "Register").click();
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");
  });
});
