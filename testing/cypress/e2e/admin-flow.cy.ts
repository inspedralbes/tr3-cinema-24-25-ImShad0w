describe("Admin Flow - Dashboard", () => {
  beforeEach(() => {
    cy.visit("/admin");
  });

  it("should display admin page title", () => {
    cy.contains("Esdeveniments Actuals").should("be.visible");
  });

  it("should have 'Crear Esdeveniment' button", () => {
    cy.contains("button", "Crear Esdeveniment").should("be.visible");
  });

});

describe("Admin Flow - Create Event", () => {
  beforeEach(() => {
    cy.visit("/admin/event/new");
  });

  it("should display create event form", () => {
    cy.contains("Crear Esdeveniment").should("be.visible");
  });

  it("should have all required form fields", () => {
    cy.get('input[name="title"]').should("be.visible");
    cy.get('textarea[name="description"]').should("be.visible");
    cy.get('input[name="location"]').should("be.visible");
    cy.get('input[name="date"]').should("be.visible");
    cy.get('input[name="seats_count"]').should("be.visible");
  });

  it("should have submit and cancel buttons", () => {
    cy.contains("button", "Crear Esdeveniment").should("be.visible");
    cy.contains("button", "Cancel·lar").should("be.visible");
  });

  it("should create event successfully", () => {
    const eventTitle = `Admin Test Event ${Date.now()}`;

    cy.get('input[name="title"]').type(eventTitle);
    cy.get('textarea[name="description"]').type("Test description for admin event");
    cy.get('input[name="location"]').type("Admin Test Location");
    cy.get('input[name="date"]').type("2025-12-31T20:00");
    cy.get('input[name="seats_count"]').clear().type("5");

    cy.contains("button", "Crear Esdeveniment").click();

    cy.url({ timeout: 10000 }).should("include", "/admin");
    cy.contains(eventTitle).should("be.visible");
  });

  it("should navigate back to admin when clicking cancel", () => {
    cy.visit("/admin");
    cy.contains("button", "Crear Esdeveniment").click();
    cy.contains("button", "Cancel·lar").click();

    cy.url().should("include", "/admin");
  });
});

describe("Admin Flow - Edit Event", () => {
  let eventId: number;

  beforeEach(() => {
    cy.createTestEvent({
      title: "Event To Edit",
      description: "This event will be edited",
      location: "Original Location",
      seats_count: 50,
    }).then((id) => {
      eventId = id as number;
    });
  });

  afterEach(() => {
    if (eventId) {
      cy.deleteTestEvent(eventId);
    }
  });

  it("should navigate to edit page", () => {
    cy.visit(`/admin/event/${eventId}/edit`);

    cy.contains("Modificar Esdeveniment").should("be.visible");
  });

  it("should pre-fill form with existing event data", () => {
    cy.visit(`/admin/event/${eventId}/edit`);

    cy.get('input[name="title"]').should("have.value", "Event To Edit");
    cy.get('textarea[name="description"]').should("have.value", "This event will be edited");
    cy.get('input[name="location"]').should("have.value", "Original Location");
  });

  it("should update event successfully", () => {
    cy.visit(`/admin/event/${eventId}/edit`);

    cy.get('input[name="title"]').clear().type("Updated Event Title");
    cy.get('input[name="location"]').clear().type("New Location");

    cy.contains("button", "Guardar Canvis").click();

    cy.url({ timeout: 10000 }).should("include", "/admin");
    cy.contains("Updated Event Title").should("be.visible");
  });

  it("should navigate back to admin when clicking cancel", () => {
    cy.visit(`/admin/event/${eventId}/edit`);
    cy.contains("button", "Cancel·lar").click();

    cy.url().should("include", "/admin");
  });
});

describe("Admin Flow - Delete Event", () => {
  let eventId: number;

  beforeEach(() => {
    cy.createTestEvent({
      title: "Event To Delete",
      description: "This event will be deleted",
      location: "Delete Location",
      seats_count: 30,
    }).then((id) => {
      eventId = id as number;
      cy.visit("/admin");
    });
  });

  afterEach(() => {
    if (eventId) {
      cy.deleteTestEvent(eventId);
    }
  });

  it("should display delete button for each event", () => {
    cy.contains("Event To Delete").should("be.visible");
    cy.contains("button", "Eliminar").should("be.visible");
  });

  it("should confirm before deleting", () => {
    cy.on("window:confirm", (str) => {
      expect(str).to.equal("Segur que vols eliminar aquest esdeveniment?");
    });

    cy.contains("Event To Delete")
      .parents('[data-testid="admin-event-card"]')
      .contains("button", "Eliminar")
      .click();
  });

  it("should delete event after confirmation", () => {
    cy.contains("Event To Delete").should("be.visible");

    cy.on("window:confirm", () => true);

    cy.contains("Event To Delete")
      .parents('[data-testid="admin-event-card"]')
      .contains("button", "Eliminar")
      .click();

    cy.contains("Event To Delete", { timeout: 10000 }).should("not.exist");
  });
});

describe("Admin Flow - Event List", () => {
  let eventIds: number[] = [];

  beforeEach(() => {
    const createEvents = [];
    for (let i = 0; i < 3; i++) {
      createEvents.push(
        cy.createTestEvent({
          title: `List Test Event ${i}`,
          description: `Test event ${i}`,
          location: "Test",
          seats_count: 5,
        }).then((id) => {
          if (id) eventIds.push(id);
        })
      );
    }
    cy.visit("/admin");
  });

  afterEach(() => {
    eventIds.forEach((id) => {
      cy.deleteTestEvent(id);
    });
  });

  it("should display multiple events in list", () => {
    cy.get('[data-testid="admin-event-card"]', { timeout: 15000 }).should(
      "have.length.gte",
      3
    );
  });

  it("should have edit button for each event", () => {
    cy.get('[data-testid="admin-event-card"]', { timeout: 15000 })
      .first()
      .within(() => {
        cy.contains("button", "Modificar").should("be.visible");
      });
  });
});
