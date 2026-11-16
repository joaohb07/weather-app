describe('Weather App - Fluxo E2E', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve renderizar o estado inicial com barra de busca e mapa sem país destacado', () => {
    cy.get('input[placeholder*="Digite uma cidade"]').should('be.visible')
    cy.contains('button', 'Buscar').should('be.disabled')
    cy.get('path[data-highlighted="true"]').should('have.length', 0)
    cy.get('[data-testid="map-pin"]').should('not.exist')
  })

  it('deve buscar uma cidade, exibir dados climáticos e destacar o país no mapa', () => {
    cy.intercept('GET', '/weather?address=Barcelona', {
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
    }).as('getWeather')

    cy.get('input[placeholder*="Digite uma cidade"]').type('Barcelona')
    cy.contains('button', 'Buscar').should('not.be.disabled').click()

    cy.wait('@getWeather')

    cy.contains('Spain').should('be.visible')
    cy.contains('Barcelona, Catalonia, Spain').should('be.visible')
    cy.contains('16°C').should('be.visible')
    cy.contains('few clouds').should('be.visible')
    cy.contains('15.5°C').should('be.visible')
    cy.contains('66%').should('be.visible')

    // Valida destaque no SVG e pin na coordenada
    cy.get('path[data-highlighted="true"]').should('have.length', 1)
    cy.get('[data-testid="map-pin"]').should('exist')
  })

  it('deve exibir alerta de erro quando a localização não for encontrada', () => {
    cy.intercept('GET', '/weather?address=CidadeInexistente', {
      statusCode: 400,
      body: {
        error: 'Unable to find location. Try another search!'
      }
    }).as('getWeatherError')

    cy.get('input[placeholder*="Digite uma cidade"]').type('CidadeInexistente')
    cy.contains('button', 'Buscar').click()

    cy.wait('@getWeatherError')

    cy.contains('Unable to find location. Try another search!').should('be.visible')
    cy.get('path[data-highlighted="true"]').should('have.length', 0)
  })

  it('deve limpar o card e resetar o mapa ao clicar no botão de reset', () => {
    cy.intercept('GET', '/weather?address=Tokyo', {
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
    }).as('getTokyo')

    cy.get('input[placeholder*="Digite uma cidade"]').type('Tokyo')
    cy.contains('button', 'Buscar').click()
    cy.wait('@getTokyo')

    cy.get('path[data-highlighted="true"]').should('have.length', 1)

    cy.get('button[title="Resetar mapa"]').click()

    cy.get('input[placeholder*="Digite uma cidade"]').should('have.value', '')
    cy.get('path[data-highlighted="true"]').should('have.length', 0)
    cy.get('[data-testid="map-pin"]').should('not.exist')
  })

  it('deve abrir e fechar o modal de informações do projeto', () => {
    cy.get('button[aria-label="Sobre o projeto"]').click()
    cy.contains('Repositório no GitHub').should('be.visible')
    cy.contains('Documentação').should('be.visible')

    // Fecha clicando no overlay escuro
    cy.get('.fixed.inset-0.z-30').click('topLeft')
    cy.contains('Repositório no GitHub').should('not.exist')
  })
})