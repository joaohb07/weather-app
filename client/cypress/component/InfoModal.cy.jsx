import { mount } from 'cypress/react'
import '../../src/index.css'
import i18n from '../../src/i18n'
import InfoModal from '../../src/components/InfoModal'

describe('<InfoModal />', () => {
  beforeEach(() => {
    i18n.changeLanguage('en')
  })

  it('starts closed and opens when clicking the info button', () => {
    mount(<InfoModal />)

    cy.contains('GitHub Repository').should('not.exist')

    cy.get('button[aria-label="About the project"]').click()

    cy.contains('h3', 'Weather App').should('be.visible')
    cy.contains('a', 'GitHub Repository').should(
      'have.attr',
      'href',
      'https://github.com/joaohb07/weather-app'
    )
    cy.contains('a', 'Documentation').should(
      'have.attr',
      'href',
      'https://joaohb07.github.io/documentation/'
    )
  })

  it('closes modal when clicking outside overlay', () => {
    mount(<InfoModal />)

    cy.get('button[aria-label="About the project"]').click()
    cy.contains('GitHub Repository').should('be.visible')

    cy.get('.fixed.inset-0.z-30').click('topLeft')
    cy.contains('GitHub Repository').should('not.exist')
  })
})