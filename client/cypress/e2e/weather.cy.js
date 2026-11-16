describe('Weather App - E2E Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders initial state in English with search bar and unhighlighted map', () => {
    cy.get('input[placeholder*="Type a city"]').should('be.visible')
    cy.contains('button', 'Search').should('be.disabled')
    cy.get('path[data-highlighted="true"]').should('have.length', 0)
    cy.get('[data-testid="map-pin"]').should('not.exist')
  })

  it('switches UI language between English and Portuguese via the top pill', () => {
    cy.get('[data-testid="lang-pt"]').click()
    cy.get('input[placeholder*="Digite uma cidade"]').should('be.visible')
    cy.contains('button', 'Buscar').should('be.disabled')

    cy.get('[data-testid="lang-en"]').click()
    cy.get('input[placeholder*="Type a city"]').should('be.visible')
    cy.contains('button', 'Search').should('be.disabled')
  })

  it('searches a city, displays weather metrics, and highlights the country on the map', () => {
    cy.intercept(
      { method: 'GET', pathname: '/weather' },
      {
        statusCode: 200,
        body: {
          placeName: 'Barcelona, Catalonia, Spain',
          latitude: 41.3874,
          longitude: 2.1686,
          countryCode: 'ESP',
          countryName: 'Spain',
          forecastData: {
            weather_description: 'few clouds',
            temperature: 16.4,
            feels_like: 15.5,
            humidity: 66,
            icon: '02d'
          }
        }
      }
    ).as('getWeather')

    cy.get('input[placeholder*="Type a city"]').type('Barcelona')
    cy.contains('button', 'Search').should('not.be.disabled').click()

    cy.wait('@getWeather')

    cy.contains('Spain').should('be.visible')
    cy.contains('Barcelona, Catalonia, Spain').should('be.visible')
    cy.contains('16°C').should('be.visible')
    cy.contains('few clouds').should('be.visible')
    cy.contains('15.5°C').should('be.visible')
    cy.contains('66%').should('be.visible')

    cy.get('path[data-highlighted="true"]').should('have.length', 1)
    cy.get('[data-testid="map-pin"]').should('exist')
  })

  it('displays localized error alert when location is not found', () => {
    cy.intercept(
      { method: 'GET', pathname: '/weather' },
      {
        statusCode: 400,
        body: {
          error: 'Unable to find location. Try another search!'
        }
      }
    ).as('getWeatherError')

    cy.get('input[placeholder*="Type a city"]').type('UnknownCityXYZ')
    cy.contains('button', 'Search').click()

    cy.wait('@getWeatherError')

    cy.contains('Unable to find location. Try another search!').should('be.visible')
    cy.get('path[data-highlighted="true"]').should('have.length', 0)

    // Switch to Portuguese and verify error message translates dynamically
    cy.get('[data-testid="lang-pt"]').click()
    cy.contains('Não foi possível encontrar a localização. Tente outra busca!').should('be.visible')
  })

  it('clears card and resets map when reset button is clicked', () => {
    cy.intercept(
      { method: 'GET', pathname: '/weather' },
      {
        statusCode: 200,
        body: {
          placeName: 'Tokyo, Japan',
          latitude: 35.6762,
          longitude: 139.6503,
          countryCode: 'JPN',
          countryName: 'Japan',
          forecastData: {
            weather_description: 'clear sky',
            temperature: 24.0,
            feels_like: 23.8,
            humidity: 50,
            icon: '01d'
          }
        }
      }
    ).as('getTokyo')

    cy.get('input[placeholder*="Type a city"]').type('Tokyo')
    cy.contains('button', 'Search').click()
    cy.wait('@getTokyo')

    cy.get('path[data-highlighted="true"]').should('have.length', 1)

    cy.get('button[title="Reset map"]').click()

    cy.get('input[placeholder*="Type a city"]').should('have.value', '')
    cy.get('path[data-highlighted="true"]').should('have.length', 0)
    cy.get('[data-testid="map-pin"]').should('not.exist')
  })

  it('opens and closes the project info modal', () => {
    cy.get('button[aria-label="About the project"]').click()
    cy.contains('GitHub Repository').should('be.visible')
    cy.contains('Documentation').should('be.visible')

    cy.get('.fixed.inset-0.z-30').click('topLeft')
    cy.contains('GitHub Repository').should('not.exist')
  })
})