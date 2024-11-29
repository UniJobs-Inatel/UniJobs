import { login } from "../helpers/auth";

describe('CompanyProfile', () => {
  
  it('it should complete a company profile', () => {
    
    login('companyReg@yopmail.com', 'Senh@123')

    cy.url().should('include', '/perfil-empresa');

    cy.get('input[name=name]').type('TechNova Solutions"');
    cy.get('input[name=cnpj]').type('98198615000179');
    cy.get('input[name=description]').type('Empresa especializada em soluções de software sob medida para startups.');
    cy.get('input[name=field_of_activity]').type('Desenvolvimento de Software');
    cy.get('input[name=contact_website]').type('https://technova.com');

    cy.contains('Salvar').click();

    cy.contains('Empresa salva com sucesso')
    
  });

});

describe('StudentProfile', () => {
  
  it('it should complete a company profile', () => {
    
    login('studentCy@yopmail.com', 'Senh@123')
    
    cy.url().should('include', '/perfil-estudante');

    cy.get('input[name=first_name]').type('Jeniffer');
    cy.get('input[name=last_name]').type('Souza');
    cy.get('input[name=cpf]').type('19609012060');
    
    cy.get('[data-cy="multiSelect"]').click()
    
    cy.get('[data-cy="multiSelect-item"]').first().click()
    
    cy.get('[data-cy="multiSelect"]').click()
    
    cy.contains('Adicionar Experiência').click()
    
    cy.get('input[value=professional]').click()
    cy.get('input[name=position]').type('Especialista em Marketing Digital');
    cy.get('input[name=company_name]').type('DigitalExpand');
    cy.get('input[name=start_date]').type('10/06/2021');
    cy.get('input[name=end_date]').type('01/11/2022');
    cy.get('textarea[name=description]').type('Planejamento e execução de estratégias de SEO e campanhas de anúncios pagos.');
    
    cy.get('[data-cy=experience-button]').click();
    
    cy.get('[data-cy="experiences"]').first().within(() => {
      cy.get('h3')
        .should('be.visible')
        .and('contain.text', 'Especialista em Marketing Digital'); 
    });

    cy.get('button').contains('Salvar').click()
    
  });

})