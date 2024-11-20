// cypress/integration/login.spec.ts

describe('Login Test', () => {
  it('should log in successfully with valid credentials', () => {
    // Acessa a página de login
    cy.visit('/');
    
    // Preenche o campo de nome de usuário
    cy.get('input[name=email]').type('juli@ges.inatel.br');
    
    // Preenche o campo de senha
    cy.get('input[name=password]').type('senha123');
    
    // Submete o formulário de login pressionando ENTER
    cy.get('input[name=password]').type('{enter}', { log: false });
    
    // Verifica se a URL foi alterada para a página do dashboard
    cy.url().should('include', '/vagas');
    
    // cy.window().then((window) => {
    //   const localStorageData = window.localStorage.getItem('session');
    //   expect(localStorageData).to.exist; 
    
    //   if (localStorageData) {
    //     const parsedData = JSON.parse(localStorageData); 
    
        
    //     expect(parsedData.accessToken).to.exist;

    
    //     const typedEmail = 'juli@ges.inatel.br'; 
    //     expect(parsedData.email).to.equal(typedEmail); 
    //   }
    // });
  });
});
