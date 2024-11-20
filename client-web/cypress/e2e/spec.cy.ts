// cypress/integration/login.spec.ts

describe('Login Test', () => {
  it('should log in successfully with valid credentials', () => {
    cy.visit('/');
    
    cy.get('input[name=email]').type('juli@ges.inatel.br');
    
    cy.get('input[name=password]').type('senha123');
    
    cy.get('input[name=password]').type('{enter}', { log: false });
    
    cy.url().should('include', '/vagas');
    
    cy.window().then((window) => {
      const localStorageData = window.localStorage.getItem('session');
      expect(localStorageData).to.exist; 

      
      if (localStorageData) {
        const parsedData = JSON.parse(localStorageData); 
        
        expect(parsedData.accessToken).to.exist;

        const typedEmail = 'juli@ges.inatel.br'; 
        expect(parsedData.user.email).to.equal(typedEmail); 
      }
    });
  });
});
