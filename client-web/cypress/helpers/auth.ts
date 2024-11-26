export const login = (email: string, password: string) => {
    cy.visit('/');
    
    cy.get('input[name=email]').type(email);
    
    cy.get('input[name=password]').type(password);
    
    cy.get('input[name=password]').type('{enter}', { log: false });
  };

  export const register = (email: string, password: string, type:string) => {
    cy.visit('/');

    cy.contains('Cadastrar-se').click();
    
    cy.get('input[name=email]').type(email);
    
    cy.get('input[name=password]').type(password);

    cy.get('input[name=confirmPass]').type(password);
    
    cy.get(`input[value=${type}]`).click();

    cy.get('input[name=confirmPass]').type('{enter}', { log: false });
  };