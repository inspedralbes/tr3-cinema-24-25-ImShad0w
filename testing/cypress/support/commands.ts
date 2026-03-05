/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      createTestEvent: (event?: Partial<{
        title: string;
        description: string;
        location: string;
        date: string;
        seats_count: number;
      }>) => Chainable<number>;
      deleteTestEvent: (eventId: number) => Chainable<void>;
      waitForSocketConnection: () => Chainable<void>;
      selectSeat: (seatNumber: number) => Chainable<void>;
      reserveSelectedSeats: () => Chainable<void>;
      buyReservedSeats: () => Chainable<void>;
    }
  }
}

const API_BASE_URL = "https://localhost/api";

Cypress.Commands.add("createTestEvent", (event) => {
  const defaultEvent = {
    title: `Test Event ${Date.now()}`,
    description: "This is a test event for E2E testing",
    location: "Test Location",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    seats_count: 50,
  };

  const eventData = { ...defaultEvent, ...event };

  return cy.request({
    method: "POST",
    url: `${API_BASE_URL}/event`,
    body: eventData,
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 201 || response.status === 200) {
      const eventId = response.body?.data?.id || response.body?.id;
      cy.wrap(eventId);
    } else {
      cy.wrap(null);
    }
  });
});

Cypress.Commands.add("deleteTestEvent", (eventId: number) => {
  if (!eventId) return;
  cy.request({
    method: "DELETE",
    url: `${API_BASE_URL}/event/${eventId}`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("waitForSocketConnection", () => {
  cy.wait(2000);
});

Cypress.Commands.add("selectSeat", (seatNumber: number) => {
  cy.get(`[data-seat="${seatNumber}"]`).click();
});

Cypress.Commands.add("reserveSelectedSeats", () => {
  cy.contains("button", "Reservar").click();
});

Cypress.Commands.add("buyReservedSeats", () => {
  cy.contains("button", "Comprar Ara").click();
});

export { };
