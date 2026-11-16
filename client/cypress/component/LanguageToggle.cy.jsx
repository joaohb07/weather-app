import { mount } from 'cypress/react'
import '../../src/index.css'
import i18n from '../../src/i18n'
import LanguageToggle from '../../src/components/LanguageToggle'

/**
 * Component test suite for `<LanguageToggle />`.
 * Verifies accessible toggle state (`aria-pressed`) and i18next language switching.
 */
describe('<LanguageToggle />', () => {
  // Ensure deterministic starting locale before each test
  beforeEach(() => {
    i18n.changeLanguage('en')
  })

  it('renders EN as active by default and switches to PT when clicked', () => {
    mount(<LanguageToggle />)

    // Assert initial ARIA pressed states match the English default
    cy.get('[data-testid="lang-en"]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-testid="lang-pt"]').should('have.attr', 'aria-pressed', 'false')

    // Click the Portuguese button and verify ARIA pressed states swap
    cy.get('[data-testid="lang-pt"]').click()

    cy.get('[data-testid="lang-pt"]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-testid="lang-en"]').should('have.attr', 'aria-pressed', 'false')
  })
})