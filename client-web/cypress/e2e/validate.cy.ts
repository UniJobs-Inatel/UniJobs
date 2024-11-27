import { login } from "../helpers/auth";

describe('Validate Job', () => {
  
  it('it should approve a job ', () => {
    
    login('inatel@college.com', 'Senh@123')

    cy.url().should('include', '/perfil-empresa');

    cy.get('[data-cy="publish-validate-button"]').first()
    .click();
    
    cy.contains('Deseja validar essa vaga?').should('be.visible');
    
    cy.get('[data-cy="agree-button"]').click();
    
    cy.contains('Vaga validada com sucesso').should('be.visible');
    

  });

  it('it should reprove a job ', () => {
    
    login('inatel@college.com', 'Senh@123')

    cy.url().should('include', '/perfil-empresa');

    cy.get('[data-cy="publish-validate-button"]').first()
    .click();
    
    cy.contains('Deseja validar essa vaga?').should('be.visible');
    
    cy.get('[data-cy="decline-button"]').click();
    
    cy.contains('Vagas reprovada com sucesso').should('be.visible');
    
  });

})