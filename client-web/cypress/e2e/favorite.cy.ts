import { login } from "../helpers/auth";

describe('Favoritar Vagas e Listar Favoritas', () => {
    beforeEach(() => {
        login('manu@gec.inatel.br', 'Senh@123')
        cy.url().should('include', '/vagas');
    });

    it('Deve favoritar uma vaga e verificar o estado do botão', () => {
        cy.get('[data-cy="jobcard"]').should('have.length.greaterThan', 0);

        cy.get('[data-cy="jobcard"]').first().within(() => {
            cy.get('[data-cy="favorite-button"]')
                .should('not.have.class', 'text-primary').click();
        });

        cy.get('[data-cy="jobcard"]').first().within(() => {
            cy.get('[data-cy="favorite-button"]').should('have.class', 'text-primary').click()
        });

    });

    it('Deve listar corretamente as vagas favoritas', () => {
        cy.get('[data-cy="jobcard"]').each(($card, index) => {
            if (index < 1) {
                cy.wrap($card).within(() => {
                    cy.get('[data-cy="favorite-button"]').click();
                });
            }
        });

        cy.get('[data-cy="favorites-button"]').click();

        cy.get('[data-cy="jobcard"]').should('have.length', 1);

        cy.get('[data-cy="jobcard"]').first().within(() => {
            cy.get('[data-cy="favorite-button"]').should('have.class', 'text-primary').click()
        });
    });

    it('Deve desfavoritar uma vaga e removê-la da lista de favoritas', () => {
        cy.get('[data-cy="jobcard"]').first().within(() => {
            cy.get('[data-cy="favorite-button"]').click();
        });

        cy.get('[data-cy="favorites-button"]').click();

        cy.get('[data-cy="jobcard"]').should('have.length', 1);


        cy.get('[data-cy="jobcard"]').first().within(() => {
            cy.get('[data-cy="favorite-button"]').click();
        });

        cy.get('[data-cy="jobcard"]').should('have.length', 0);
    });
});
