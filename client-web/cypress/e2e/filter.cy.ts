
import { login } from "../helpers/auth";

describe('Filtragem de Vagas', () => {

    beforeEach(() => {
        login('manu@gec.inatel.br', 'senha123')
        cy.url().should('include', '/vagas');
    });

    it('Deve filtrar vagas com base em localização, tipo e salário', () => {
        cy.get('[data-cy="filter-button"]').click();

        cy.get('input[placeholder="Localização..."]')
            .type('Santa Rita do Sapucaí')
            .should('have.value', 'Santa Rita do Sapucaí');

        cy.get('button').contains('Todos').eq(0).click({ force: true });
        cy.get('[data-state="open"]')
            .find('[role="option"]')
            .contains('CLT')
            .click({ force: true });

        cy.get('button').contains('Aplicar Filtros').click();

        cy.get('[data-cy="jobcard"]').each(($card) => {
            cy.wrap($card)
                .find('[data-cy="job-location"]')
                .contains('Santa Rita do Sapucaí');

            cy.wrap($card)
                .find('[data-cy="job-type"]')
                .contains('CLT');

        });
    });

    it('Deve limpar os filtros corretamente', () => {
        cy.get('[data-cy="filter-button"]').click();

        cy.get('input[placeholder="Localização..."]').type('Rio de Janeiro');
        cy.get('input[name="minSalary"]').type('1500');

        cy.get('button').contains('Aplicar Filtros').click();

        cy.get('[data-cy="filter-button"]').click();

        cy.get('button').contains('Limpar Filtros').click();

        cy.get('input[placeholder="Localização..."]').should('have.value', '');
        cy.get('input[name="minSalary"]').should('have.value', '');
        cy.get('input[name="maxSalary"]').should('have.value', '');
    });
});
