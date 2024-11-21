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

describe('Job Registration Test', () => {
  beforeEach(() => {
    // Faz login com um usuário do tipo "company"
    cy.visit('/');
    cy.get('input[name=email]').type('techcorp@company.com');
    cy.get('input[name=password]').type('senha123{enter}', { log: false });

    // Verifica se o login foi bem-sucedido
    cy.url().should('include', '/vagas');
  });

  it('should successfully register a new job', () => {
    // Navega até a página de cadastro de vaga
    cy.contains('Cadastrar Vaga').click();

    // Verifica se está na página correta
    cy.url().should('include', '/cadastrar-vaga');

    // Preenche o formulário de cadastro
    cy.get('input[name="job_name"]').type('Desenvolvedor Frontend');
    cy.get('input[name="location"]').type('São Paulo');

    cy.get('button').contains('Selecione o tipo de vaga').should('be.visible');
    cy.get('button').contains('Selecione o tipo de vaga').click({ force: true });
    cy.get('[data-state="open"]')
      .find('[role="option"]')
      .contains('CLT')
      .click({ force: true });

      cy.get('button').contains('Selecione a modalidade').should('be.visible');
      cy.get('button').contains('Selecione a modalidade').click({ force: true });
      cy.get('[data-state="open"]')
        .find('[role="option"]')
        .contains('Remoto')
        .click({ force: true });

        cy.get('button').contains('Selecione a área de atuação').should('be.visible');
        cy.get('button').contains('Selecione a área de atuação').click({ force: true });
        cy.get('[data-state="open"]')
          .find('[role="option"]')
          .contains('TI')
          .click({ force: true });

    // Preenche os outros campos
    cy.get('input[name="weekly_hours"]').type('40');
    cy.get('input[name="salary"]').type('5000');
    cy.get('textarea[name="description"]').type('Descrição da vaga para Desenvolvedor Frontend');
    cy.get('textarea[name="requirements"]').type('Requisitos: Experiência em React.');
    cy.get('textarea[name="benefits"]').type('Benefícios: Vale alimentação, Vale transporte.');

    // Submete o formulário
    cy.get('button[type=submit]').click();

    // Verifica se o cadastro foi bem-sucedido
    cy.url().should('include', '/perfil-empresa');
  });
});
