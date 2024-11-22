import { login } from "../helpers/auth";

describe('routing tests', () => {
  it('it should return to login page if is not logged', () => {
    cy.visit('/vagas')
    cy.get('input[name="email"]').should('be.visible');
    cy.contains('Entrar').should('be.visible');
  });

  it('it should go to company profile when try to access no company routes ', () => {
    
    login('techcorp@company.com', 'senha123')

    cy.url().should('include', '/perfil-empresa');
    
    cy.visit('/perfil-estudante');
    
    cy.url().should('include', '/perfil-empresa');

  });

})