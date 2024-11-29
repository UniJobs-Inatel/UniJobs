import { login } from "../helpers/auth";

describe('Publish Job', () => {
  
  it('it should publish a job ', () => {
    
    login('techcorp@company.com', 'Senh@123')

    cy.url().should('include', '/perfil-empresa');

    cy.get('[data-cy="publish-validate-button"]').first()
    .click();
    
    cy.get('[data-cy="select-ies-modal"]').should('be.visible');
    
    
    cy.get('[data-cy="publish-ies-0"]').click();
    
    cy.contains('Vaga publicada com sucesso').should('be.visible');
    
  });

})