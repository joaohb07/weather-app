import { mount } from 'cypress/react'
import '../../src/index.css'
import WorldMap from '../../src/components/WorldMap'

describe('<WorldMap />', () => {
  it('renderiza o mapa sem país destacado ou pin quando location é null', () => {
    mount(<WorldMap location={null} temperature={undefined} />)

    cy.get('svg path').should('have.length.greaterThan', 100)
    cy.get('path[data-highlighted="true"]').should('have.length', 0)
    cy.get('[data-testid="map-pin"]').should('not.exist')
  })

  it('destaca o país em azul (#0284c7) para temperaturas frias (<= 10°C) e exibe o pin', () => {
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

  it('destaca o país em coral (#e11d48) para temperaturas muito quentes (> 30°C)', () => {
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