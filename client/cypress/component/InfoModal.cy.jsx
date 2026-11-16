import { mount } from 'cypress/react'
import '../../src/index.css'
import InfoModal from '../../src/components/InfoModal'

describe('<InfoModal />', () => {
  it('inicia fechado e abre ao clicar no botão de informação', () => {
    mount(<InfoModal />)

    cy.contains('Repositório no GitHub').should('not.exist')

    cy.get('button[aria-label="Sobre o projeto"]').click()

    cy.contains('h3', 'Weather App').should('be.visible')
    cy.contains('a', 'Repositório no GitHub').should(
      'have.attr',
      'href',
      'https://github.com/joaohb07/weather-app'
    )
    cy.contains('a', 'Documentação').should(
      'have.attr',
      'href',
      'https://joaohb07.github.io/documentation/'
    )
  })

  it('fecha o modal ao clicar fora (overlay)', () => {
    mount(<InfoModal />)

    cy.get('button[aria-label="Sobre o projeto"]').click()
    cy.contains('Repositório no GitHub').should('be.visible')

    cy.get('.fixed.inset-0.z-30').click('topLeft')
    cy.contains('Repositório no GitHub').should('not.exist')
  })
})