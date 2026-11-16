import { mount } from 'cypress/react'
import '../../src/index.css'
import WeatherCard from '../../src/components/WeatherCard'

describe('<WeatherCard />', () => {
  it('renderiza o estado inicial com o botão Buscar desabilitado', () => {
    mount(
      <WeatherCard
        weather={null}
        loading={false}
        error={null}
        onSearch={cy.stub()}
        onReset={cy.stub()}
      />
    )

    cy.get('input[placeholder*="Digite uma cidade"]').should('be.visible')
    cy.contains('button', 'Buscar').should('be.disabled')
    cy.get('button[title="Resetar mapa"]').should('not.exist')
  })

  it('chama onSearch com o texto limpo (trim) ao submeter o formulário', () => {
    const onSearchSpy = cy.spy().as('onSearchSpy')

    mount(
      <WeatherCard
        weather={null}
        loading={false}
        error={null}
        onSearch={onSearchSpy}
        onReset={cy.stub()}
      />
    )

    cy.get('input[placeholder*="Digite uma cidade"]').type('  Porto  ')
    cy.contains('button', 'Buscar').should('not.be.disabled').click()

    cy.get('@onSearchSpy').should('have.been.calledOnceWith', 'Porto')
  })

  it('exibe spinner e bloqueia o botão durante o carregamento', () => {
    mount(
      <WeatherCard
        weather={null}
        loading={true}
        error={null}
        onSearch={cy.stub()}
        onReset={cy.stub()}
      />
    )

    cy.get('button[type="submit"]').should('be.disabled')
    cy.get('button[type="submit"] svg.animate-spin').should('exist')
  })

  it('renderiza os dados meteorológicos e dispara onReset ao clicar em resetar', () => {
    const onResetSpy = cy.spy().as('onResetSpy')
    const mockWeather = {
      placeName: 'Porto, Portugal',
      countryName: 'Portugal',
      forecastData: {
        weather_description: 'broken clouds',
        temperature: 17.4,
        feels_like: 16.9,
        humidity: 82,
        icon: '04d'
      }
    }

    mount(
      <WeatherCard
        weather={mockWeather}
        loading={false}
        error={null}
        onSearch={cy.stub()}
        onReset={onResetSpy}
      />
    )

    cy.contains('Portugal').should('be.visible')
    cy.contains('Porto, Portugal').should('be.visible')
    cy.contains('17°C').should('be.visible')
    cy.contains('broken clouds').should('be.visible')
    cy.contains('16.9°C').should('be.visible')
    cy.contains('82%').should('be.visible')

    cy.get('button[title="Resetar mapa"]').click()
    cy.get('@onResetSpy').should('have.been.calledOnce')
  })

  it('exibe o card de alerta quando recebe uma mensagem de erro', () => {
    mount(
      <WeatherCard
        weather={null}
        loading={false}
        error="Unable to find location. Try another search!"
        onSearch={cy.stub()}
        onReset={cy.stub()}
      />
    )

    cy.contains('Unable to find location. Try another search!').should('be.visible')
    cy.get('button[title="Resetar mapa"]').should('be.visible')
  })
})