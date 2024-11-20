import { login } from "../helpers/auth";

describe('routing tests', () => {
  
  it('it should publish a job ', () => {
    
    login('techcorp@company.com', 'senha123')

    cy.url().should('include', '/perfil-empresa');

    cy.get('[data-cy="publish-validate-button"]').first()
    .click();
    
    cy.get('[data-cy="select-ies-modal"]').should('be.visible');
    
    
    cy.get('[data-cy="publish-ies-0"]').click();
    
    cy.contains('Vaga publicada com sucesso').should('be.visible');
    
    cy.get('[data-cy="feedback-button"]').click();
    
  });

})