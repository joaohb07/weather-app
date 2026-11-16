import { mount } from 'cypress/react'
import '../../src/index.css'
import WorldMap from '../../src/components/WorldMap'

describe('<WorldMap />', () => {
  it('renders the map with no highlighted country or pin when location is null', () => {
    mount(<WorldMap location={null} temperature={undefined} />)

    cy.get('svg path').should('have.length.greaterThan', 100)
    cy.get('path[data-highlighted="true"]').should('have.length', 0)
    cy.get('[data-testid="map-pin"]').should('not.exist')
  })

  it('highlights country in blue (#0284c7) for cold temperatures (<= 10°C) and renders pin', () => {
    const location = {
      countryCode: 'PRT',
      latitude: 41.1496,
      longitude: -8.6109
    }

    mount(<WorldMap location={location} temperature={6} />)

    cy.get('path[data-highlighted="true"]')
      .should('have.length', 1)
      .and('have.attr', 'fill', '#0284c7')

    cy.get('[data-testid="map-pin"]').should('exist')
  })

  it('highlights country in coral (#e11d48) for hot temperatures (> 30°C)', () => {
    const location = {
      countryCode: 'BRA',
      latitude: -23.5505,
      longitude: -46.6333
    }

    mount(<WorldMap location={location} temperature={34} />)

    cy.get('path[data-highlighted="true"]')
      .should('have.length', 1)
      .and('have.attr', 'fill', '#e11d48')
  })
})