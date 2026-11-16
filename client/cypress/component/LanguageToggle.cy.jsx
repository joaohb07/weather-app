import { mount } from 'cypress/react'
import '../../src/index.css'
import i18n from '../../src/i18n'
import LanguageToggle from '../../src/components/LanguageToggle'

describe('<LanguageToggle />', () => {
  beforeEach(() => {
    i18n.changeLanguage('en')
  })

  it('renders EN as active by default and switches to PT when clicked', () => {
    mount(<LanguageToggle />)

    cy.get('[data-testid="lang-en"]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-testid="lang-pt"]').should('have.attr', 'aria-pressed', 'false')

    cy.get('[data-testid="lang-pt"]').click()

    cy.get('[data-testid="lang-pt"]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[data-testid="lang-en"]').should('have.attr', 'aria-pressed', 'false')
  })
})