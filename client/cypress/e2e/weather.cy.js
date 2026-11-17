/**
 * End-to-End (E2E) test suite for the Weather App user journey.
 *
 * Strategy:
 * Uses `cy.intercept` to stub network calls to `/weather`, ensuring deterministic,
 * fast, and offline-capable tests without hitting rate limits on OpenCage or OpenWeather APIs.
 */
describe('Weather App - E2E Flow', () => {
  // Navigate to the root URL before each test case to guarantee a clean initial state
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders initial state in English with search bar and unhighlighted map', () => {
    // Verify the search input is mounted and ready for user interaction
    cy.get('input[placeholder*="Type a city"]').should('be.visible')

    // Submit button must remain disabled while the search input is empty
    cy.contains('button', 'Search').should('be.disabled')

    // No country polygon should be highlighted and no pin marker should exist before a search
    cy.get('path[data-highlighted="true"]').should('have.length', 0)
    cy.get('[data-testid="map-pin"]').should('not.exist')
  })

  it('switches UI language between English and Portuguese via the top pill', () => {
    // Switch locale to Portuguese and verify placeholder and button labels update immediately
    cy.get('[data-testid="lang-pt"]').click()
    cy.get('input[placeholder*="Digite uma cidade"]').should('be.visible')
    cy.contains('button', 'Buscar').should('be.disabled')

    // Switch back to English and confirm labels revert properly
    cy.get('[data-testid="lang-en"]').click()
    cy.get('input[placeholder*="Type a city"]').should('be.visible')
    cy.contains('button', 'Search').should('be.disabled')
  })

  it('searches a city, displays weather metrics, and highlights the country on the map', () => {
    // Freeze clock at 14:00:00 UTC so Barcelona (UTC+1) deterministically renders 15:00:00
    cy.clock(Date.UTC(2026, 10, 17, 14, 0, 0), ['Date'])

    // Stub the GET `/weather` API endpoint with a realistic Barcelona payload
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
            icon: '02d',
            timezone: 3600
          }
        }
      }
    ).as('getWeather')

    // Type a city name and submit the search form
    cy.get('input[placeholder*="Type a city"]').type('Barcelona')
    cy.contains('button', 'Search').should('not.be.disabled').click()

    // Wait for the intercepted network request to complete before asserting DOM updates
    cy.wait('@getWeather')

    // Assert formatted location, local time pill, rounded temperature, description, feels-like, and humidity
    cy.contains('Spain').should('be.visible')
    cy.contains('Barcelona, Catalonia, Spain').should('be.visible')
    cy.contains('Local time:').should('be.visible')
    cy.contains('15:00:00').should('be.visible')
    cy.contains('UTC+1').should('be.visible')
    cy.contains('16°C').should('be.visible')
    cy.contains('few clouds').should('be.visible')
    cy.contains('15.5°C').should('be.visible')
    cy.contains('66%').should('be.visible')

    // Assert the D3 world map highlighted exactly one country polygon (Spain) and placed the pin
    cy.get('path[data-highlighted="true"]').should('have.length', 1)
    cy.get('[data-testid="map-pin"]').should('exist')
  })

  it('displays localized error alert when location is not found', () => {
    // Simulate a 400 Bad Request geocoding error from the Express backend
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

    // Verify English error banner appears and map remains unhighlighted
    cy.contains('Unable to find location. Try another search!').should('be.visible')
    cy.get('path[data-highlighted="true"]').should('have.length', 0)

    // Switch to Portuguese and verify `ERROR_TRANSLATION_MAP` translates the error dynamically
    cy.get('[data-testid="lang-pt"]').click()
    cy.contains('Não foi possível encontrar a localização. Tente outra busca!').should('be.visible')
  })

  it('clears card and resets map when reset button is clicked', () => {
    // Stub a successful response for Tokyo
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
            icon: '01d',
            timezone: 32400
          }
        }
      }
    ).as('getTokyo')

    cy.get('input[placeholder*="Type a city"]').type('Tokyo')
    cy.contains('button', 'Search').click()
    cy.wait('@getTokyo')

    // Confirm country is highlighted prior to reset
    cy.get('path[data-highlighted="true"]').should('have.length', 1)

    // Click the reset icon button and verify input, map highlight, and pin are cleared
    cy.get('button[title="Reset map"]').click()

    cy.get('input[placeholder*="Type a city"]').should('have.value', '')
    cy.get('path[data-highlighted="true"]').should('have.length', 0)
    cy.get('[data-testid="map-pin"]').should('not.exist')
  })

  it('opens and closes the project info modal', () => {
    // Open modal via the bottom-right floating info button
    cy.get('button[aria-label="About the project"]').click()
    cy.contains('GitHub Repository').should('be.visible')
    cy.contains('Documentation').should('be.visible')

    // Click outside the modal card (top-left corner of the backdrop) to dismiss it
    cy.get('.fixed.inset-0.z-30').click('topLeft')
    cy.contains('GitHub Repository').should('not.exist')
  })
})