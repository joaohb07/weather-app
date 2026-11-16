import { mount } from 'cypress/react'
import '../../src/index.css'
import i18n from '../../src/i18n'
import InfoModal from '../../src/components/InfoModal'

/**
 * Component test suite for `<InfoModal />`.
 * Verifies modal visibility toggling, external link integrity, and backdrop dismissal.
 */
describe('<InfoModal />', () => {
  // Reset locale to English before each test
  beforeEach(() => {
    i18n.changeLanguage('en')
  })

  it('starts closed and opens when clicking the info button', () => {
    mount(<InfoModal />)

    // Modal content should not be mounted in the DOM before clicking the trigger
    cy.contains('GitHub Repository').should('not.exist')

    // Click the floating info trigger button
    cy.get('button[aria-label="About the project"]').click()

    // Verify modal title and external links point to the expected URLs
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

    // Open the modal first
    cy.get('button[aria-label="About the project"]').click()
    cy.contains('GitHub Repository').should('be.visible')

    // Click the top-left corner of the backdrop overlay (outside the centered modal card)
    cy.get('.fixed.inset-0.z-30').click('topLeft')
    cy.contains('GitHub Repository').should('not.exist')
  })
})