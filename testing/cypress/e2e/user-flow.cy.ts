describe("User Flow - Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the homepage with correct title and CTA", () => {
    cy.contains("PassMaster").should("be.visible");
    cy.contains("Troba i reserva entrades").should("be.visible");
    cy.contains("button", "Veure Esdeveniments").should("be.visible");
  });

  it("should navigate to events page when clicking CTA", () => {
    cy.contains("button", "Veure Esdeveniments").click();
    cy.url().should("include", "/event");
    cy.contains("Esdeveniments Actuals").should("be.visible");
  });
});

describe("User Flow - Events List", () => {
  beforeEach(() => {
    cy.visit("/event");
  });

  it("should display events page title", () => {
    cy.contains("Esdeveniments Actuals").should("be.visible");
  });

  it("should display events when loaded", () => {
    cy.get('[data-testid="event-card"]', { timeout: 15000 }).should("exist");
  });

  it("should navigate to event detail when clicking an event", () => {
    cy.get('[data-testid="event-card"]', { timeout: 15000 })
      .first()
      .within(() => {
        cy.contains("Detalls").click();
      });
    cy.url().should("include", "/event/");
  });
});

describe("User Flow - Event Detail", () => {
  let eventId: number;

  beforeEach(() => {
    cy.createTestEvent({
      title: "E2E Test Concert",
      description: "A test concert for E2E testing",
      location: "Test Arena",
      seats_count: 20,
    }).then((id) => {
      eventId = id as number;
      cy.visit(`/event/${eventId}`);
    });
  });

  afterEach(() => {
    if (eventId) {
      cy.deleteTestEvent(eventId);
    }
  });

  it("should display event details", () => {
    cy.contains("E2E Test Concert").should("be.visible");
    cy.contains("A test concert for E2E testing").should("be.visible");
    cy.contains("Test Arena").should("be.visible");
  });

  it("should display available seats count", () => {
    cy.contains(/entrades disponibles/).should("be.visible");
  });

  it("should have 'Obtenir Entrades' button", () => {
    cy.contains("button", "Obtenir Entrades").should("be.visible");
  });

  it("should navigate back to events list", () => {
    cy.contains("Tornar a Esdeveniments").click();
    cy.url().should("include", "/event");
  });
});

describe("User Flow - Seat Reservation", () => {
  let eventId: number;

  beforeEach(() => {
    cy.createTestEvent({
      title: "E2E Test Movie",
      description: "A test movie for seat reservation",
      location: "Test Cinema",
      seats_count: 10,
    }).then((id) => {
      eventId = id as number;
      cy.visit(`/event/${eventId}`);
    });
  });

  afterEach(() => {
    if (eventId) {
      cy.deleteTestEvent(eventId);
    }
  });

  it("should navigate to reservation page when getting tickets", () => {
    cy.contains("button", "Obtenir Entrades").click();
    cy.url({ timeout: 15000 }).should("include", `/event/${eventId}/reserve`);
  });

  it("should display seat map after entering reservation", () => {
    cy.contains("button", "Obtenir Entrades").click();
    cy.waitForSocketConnection();
    cy.get('[data-testid="seat-map"]', { timeout: 15000 }).should("be.visible");
  });

  it("should allow selecting seats", () => {
    cy.contains("button", "Obtenir Entrades").click();
    cy.waitForSocketConnection();

    cy.get('[data-seat]', { timeout: 15000 })
      .first()
      .should("be.visible")
      .click();

    cy.contains("Seients Seleccionats").should("be.visible");
  });

  it("should show 'Reservar' button after selecting seats", () => {
    cy.contains("button", "Obtenir Entrades").click();
    cy.waitForSocketConnection();

    cy.get('[data-seat]', { timeout: 15000 })
      .first()
      .click();

    cy.contains("button", "Reservar").should("be.visible");
  });
});

describe("User Flow - Checkout", () => {
  let eventId: number;

  beforeEach(() => {
    cy.createTestEvent({
      title: "E2E Test Show",
      description: "A test show for checkout",
      location: "Test Theater",
      seats_count: 5,
    }).then((id) => {
      eventId = id as number;
      cy.visit(`/event/${eventId}/reserve`);
    });
  });

  afterEach(() => {
    if (eventId) {
      cy.deleteTestEvent(eventId);
    }
  });

  it("should navigate to checkout when clicking buy", () => {
    cy.waitForSocketConnection();

    cy.get('[data-seat]', { timeout: 15000 })
      .first()
      .click();

    cy.contains("button", "Reservar").click();

    cy.contains("Seients Reservats", { timeout: 10000 }).should("be.visible");

    cy.contains("button", "Comprar Ara").click();

    cy.url({ timeout: 10000 }).should("include", "/checkout");
  });

  it("should display checkout form", () => {
    const seatId = 1;
    cy.visit(`/event/${eventId}/checkout?seats=${seatId}`);

    cy.contains("Checkout").should("be.visible");
    cy.contains("Nom complet").should("be.visible");
    cy.contains("Correu electrònic").should("be.visible");
  });

  it("should submit checkout form successfully", () => {
    cy.visit(`/event/${eventId}/reserve`);
    cy.waitForSocketConnection();

    cy.get('[data-seat]', { timeout: 15000 })
      .first()
      .then(($seat) => {
        const seatNumber = $seat.attr('data-seat');
        
        cy.wrap($seat).click();
        cy.contains("button", "Reservar").click();
        cy.contains("Seients Reservats", { timeout: 10000 }).should("be.visible");
        cy.contains("button", "Comprar Ara").click();

        cy.url({ timeout: 10000 }).should("include", "/checkout");

        cy.get('input[name="name"]').type("Test User");
        cy.get('input[name="email"]').type("test@example.com");
        cy.contains("button", "Comprar ara").click();

        cy.url({ timeout: 10000 }).should("include", "/success");
      });
  });
});

describe("User Flow - Success Page", () => {
  it("should display success message after purchase", () => {
    cy.visit("/event/1/success?seats=2");

    cy.contains("Compra realitzada!").should("be.visible");
    cy.contains("2 entrades comprades").should("be.visible");
  });

  it("should have button to return to home", () => {
    cy.visit("/event/1/success?seats=1");

    cy.contains("button", "Tornar a l'inici").should("be.visible");
    cy.contains("button", "Tornar a l'inici").click();

    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
});
