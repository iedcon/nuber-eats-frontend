describe("Create Account", () => {
  it("should see email / validation errors", () => {
    cy.visit("/");
    cy.findByText(/create an account/i).click();
    cy.findByPlaceholderText(/email/i).type("non@good");
    cy.findByRole("alert").should("have.text", "Please enter a valid email");
    cy.findByPlaceholderText(/email/i).clear();
    cy.findByRole("alert").should("have.text", "Email is required");
    cy.findByPlaceholderText(/email/i).type("non@good.com");
    cy.findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    cy.findByRole("alert").should("have.text", "Password is required");
  });
  it("should be able to create account and login", () => {
    cy.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccountMutation") {
        req.reply((res) => {
          res.send({
            fixture: "auth/create-account.json",
          });
        });
      }
    });
    cy.visit("/create-account");
    cy.findByPlaceholderText(/email/i).type("customer@customer.com");
    cy.findByPlaceholderText(/password/i).type("customer");
    cy.findByRole("button").click();
    cy.wait(1000);
    cy.title().should("eq", "Login | Nuber Eats");
    // @ts-ignore
    cy.login("customer@customer.com", "customer");
  });
});
