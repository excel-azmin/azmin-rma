const hostUrl = "http://rma.localhost:4700";
describe("The application loads", () => {
  before(() => {
    cy.visit(hostUrl);
    cy.get("#login_email").type("test@example.com");
    cy.get("#login_password").type("admin");
    cy.get(".btn-login").click();
  });

  it("navigates to the / route and login", () => {
    expect(cy.get("ion-card-title").contains("Welcome"));
  });

  it("navigates to the /sales route", () => {
    cy.visit(hostUrl + "/sales");
  });

  after(() => {
    cy.visit(hostUrl);
    cy.get("ion-item ion-icon[aria-label='log out']").click();
  });
});
