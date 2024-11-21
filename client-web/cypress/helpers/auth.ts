export const login = (email: string, password: string) => {
    cy.visit('/');
    
    cy.get('input[name=email]').type(email);
    
    cy.get('input[name=password]').type(password);
    
    cy.get('input[name=password]').type('{enter}', { log: false });
  };