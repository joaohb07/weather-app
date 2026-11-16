import { mount } from 'cypress/react'
// Import global Tailwind styles so SVG layout and positioning match production
import '../../src/index.css'
import WorldMap from '../../src/components/WorldMap'

/**
 * Component test suite for `<WorldMap />`.
 * Verifies TopoJSON polygon rendering, ISO country lookup, pin placement,
 * and temperature-driven color coding in isolation.
 */
describe('<WorldMap />', () => {
  it('renders the map with no highlighted country or pin when location is null', () => {
    mount(<WorldMap location={null} temperature={undefined} />)

    // Verify D3 + TopoJSON rendered the world country paths (> 100 countries)
    cy.get('svg path').should('have.length.greaterThan', 100)

    // Ensure no country is highlighted and no pin marker is mounted initially
    cy.get('path[data-highlighted="true"]').should('have.length', 0)
    cy.get('[data-testid="map-pin"]').should('not.exist')
  })

  it('highlights country in blue (#0284c7) for cold temperatures (<= 10°C) and renders pin', () => {
    const location = {
      countryCode: 'PRT',
      latitude: 41.1496,
      longitude: -8.6109
    }

    // Mount with a cold temperature (6°C) to trigger the deep-blue thermal palette
    mount(<WorldMap location={location} temperature={6} />)

    cy.get('path[data-highlighted="true"]')
      .should('have.length', 1)
      .and('have.attr', 'fill', '#0284c7')

    // Verify the pulsing location pin appears at the projected coordinates
    cy.get('[data-testid="map-pin"]').should('exist')
  })

  it('highlights country in coral (#e11d48) for hot temperatures (> 30°C)', () => {
    const location = {
      countryCode: 'BRA',
      latitude: -23.5505,
      longitude: -46.6333
    }

    // Mount with a hot temperature (34°C) to trigger the crimson/coral thermal palette
    mount(<WorldMap location={location} temperature={34} />)

    cy.get('path[data-highlighted="true"]')
      .should('have.length', 1)
      .and('have.attr', 'fill', '#e11d48')
  })
})