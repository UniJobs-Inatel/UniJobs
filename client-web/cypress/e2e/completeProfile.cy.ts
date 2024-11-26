import { login } from "../helpers/auth";

describe('CompanyProfile', () => {
  
  it('it should complete a company profile', () => {
    
    login('cyregistration@yopmail.com', 'Senh@123')

    cy.url().should('include', '/perfil-empresa');

    cy.get('input[name=name]').type('TechNova Solutions"');
    cy.get('input[name=cnpj]').type('19293703000183');
    cy.get('input[name=description]').type('Empresa especializada em soluções de software sob medida para startups.');
    cy.get('input[name=field_of_activity]').type('Desenvolvimento de Software');
    cy.get('input[name=contact_website]').type('https://technova.com');

    cy.contains('Salvar').click();

    cy.contains('Empresa salva com sucesso')
    
  });

})

// describe('StudentProfile', () => {
  
//   it('it should publish a job ', () => {
    
//     login('techcorp@company.com', 'senha123')
    
//   });

// })