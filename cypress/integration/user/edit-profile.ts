describe("Edit Profile", () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login("customer@customer.com", "customer");
  });
  it("can go to /edit-profile using the header", () => {
    cy.get('a[href="/edit-profile"]').click();
    cy.title().should("eq", "Edit Profile | Nuber Eats");
  });
  it("can change email", () => {
    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      console.log(req);
      if (req.body?.operationName === "editProfile") {
        //@ts-ignore
        req.body?.variables?.input.email = "customer@customer.com";
      }
    });
    cy.visit("/edit-profile");
    cy.findByPlaceholderText(/email/i).clear().type("newcustomer@customer.com");
    cy.findByRole("button").click();
  });
});
