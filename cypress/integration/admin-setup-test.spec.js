describe("The application loads", () => {
  it("run /api/setup", () => {
    cy.request("POST", "http://rma.localhost:4700/api/setup", {
      appURL: "http://rma.localhost:4700",
      warrantyAppURL: "http://warranty.localhost:4800",
      authServerURL: "http://erpnext.localhost",
      frontendClientId: "fa581cd534",
      backendClientId: "1f59172706",
      serviceAccountUser: "bot@example.com",
      serviceAccountSecret: "admin",
      serviceAccountApiKey: "2106f3a440a6c34",
      serviceAccountApiSecret: "85280e6ca71baaa",
    }).then((response) => {});
  });
});
