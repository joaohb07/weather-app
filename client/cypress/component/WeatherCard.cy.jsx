import { mount } from 'cypress/react'
import '../../src/index.css'
import i18n from '../../src/i18n'
import WeatherCard from '../../src/components/WeatherCard'

/**
 * Component test suite for `<WeatherCard />`.
 * Tests controlled form behavior, callback invocations via spies/stubs,
 * loading spinner states, weather data rendering, and i18n error mapping.
 */
describe('<WeatherCard />', () => {
  // Reset active i18next locale to English before each test to prevent cross-test pollution
  beforeEach(() => {
    i18n.changeLanguage('en')
  })

  it('renders initial state with disabled Search button', () => {
    // Use `cy.stub()` for required callback props that shouldn't be triggered in this test
    mount(
      <WeatherCard
        weather={null}
        loading={false}
        error={null}
        onSearch={cy.stub()}
        onReset={cy.stub()}
      />
    )

    cy.get('input[placeholder*="Type a city"]').should('be.visible')
    cy.contains('button', 'Search').should('be.disabled')
    cy.get('button[title="Reset map"]').should('not.exist')
  })

  it('calls onSearch with trimmed input on form submit', () => {
    // Create a Cypress spy aliased as `@onSearchSpy` to assert exact call arguments
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

    // Type input with leading/trailing whitespace and submit
    cy.get('input[placeholder*="Type a city"]').type('  Porto  ')
    cy.contains('button', 'Search').should('not.be.disabled').click()

    // Verify `WeatherCard` sanitized the input via `.trim()` before invoking `onSearch`
    cy.get('@onSearchSpy').should('have.been.calledOnceWith', 'Porto')
  })

  it('displays spinner and disables submit button while loading', () => {
    mount(
      <WeatherCard
        weather={null}
        loading={true}
        error={null}
        onSearch={cy.stub()}
        onReset={cy.stub()}
      />
    )

    // Submit button must be locked and render the animated Lucide loader icon
    cy.get('button[type="submit"]').should('be.disabled')
    cy.get('button[type="submit"] svg.animate-spin').should('exist')
  })

  it('renders weather metrics and triggers onReset when reset button is clicked', () => {
    const onResetSpy = cy.spy().as('onResetSpy')
    const mockWeather = {
      placeName: 'Porto, Portugal',
      countryName: 'Portugal',
      forecastData: {
        weather_description: 'broken clouds',
        temperature: 17.4,
        feels_like: 16.9,
        humidity: 82,
        icon: '04d',
        timezone: 0
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

    // Verify all formatted weather telemetry fields are displayed
    cy.contains('Portugal').should('be.visible')
    cy.contains('Porto, Portugal').should('be.visible')
    cy.contains('UTC+0').should('be.visible')
    cy.contains('17°C').should('be.visible')
    cy.contains('broken clouds').should('be.visible')
    cy.contains('16.9°C').should('be.visible')
    cy.contains('82%').should('be.visible')

    // Trigger reset button and verify `onReset` callback fires once
    cy.get('button[title="Reset map"]').click()
    cy.get('@onResetSpy').should('have.been.calledOnce')
  })

  it('renders formatted local time and UTC offset pill and ticks every second', () => {
    const fixedUtcNow = Date.UTC(2026, 10, 17, 14, 0, 0)
    const mockWeather = {
      placeName: 'Moscow, Russia',
      countryName: 'Russia',
      forecastData: {
        weather_description: 'broken clouds',
        temperature: 1.56,
        feels_like: -2.29,
        humidity: 62,
        icon: '04n',
        timezone: 10800 // UTC+3 -> 17:00:00
      }
    }

    cy.clock(fixedUtcNow, ['Date'])

    cy.window().then((win) => {
      cy.spy(win, 'setInterval').as('setIntervalSpy')
    })

    mount(
      <WeatherCard
        weather={mockWeather}
        loading={false}
        error={null}
        onSearch={cy.stub()}
        onReset={cy.stub()}
      />
    )

    cy.contains('Local time:').should('be.visible')
    cy.contains('17:00:00').should('be.visible')
    cy.contains('UTC+3').should('be.visible')

    // Verifica que o componente registrou um intervalo de 1000ms e dispara o callback
    cy.get('@setIntervalSpy').should('have.been.calledWith', Cypress.sinon.match.func, 1000)
    cy.tick(1000)
    cy.get('@setIntervalSpy').then((spy) => {
      const tickCallback = spy.args[0][0]
      tickCallback()
    })

    cy.contains('17:00:01').should('be.visible')
  })

  it('formats negative and half-hour UTC offsets accurately and translates label to Portuguese', () => {
    const fixedUtcNow = Date.UTC(2026, 10, 17, 12, 0, 0)
    i18n.changeLanguage('pt')

    const mockWeather = {
      placeName: 'Mumbai, India',
      countryName: 'India',
      forecastData: {
        weather_description: 'clear sky',
        temperature: 29.0,
        feels_like: 31.2,
        humidity: 70,
        icon: '01d',
        timezone: 19800 // UTC+5:30 -> 17:30:00
      }
    }

    cy.clock(fixedUtcNow).then(() => {
      mount(
        <WeatherCard
          weather={mockWeather}
          loading={false}
          error={null}
          onSearch={cy.stub()}
          onReset={cy.stub()}
        />
      )
    })

    cy.contains('Horário local:').should('be.visible')
    cy.contains('17:30:00').should('be.visible')
    cy.contains('UTC+5:30').should('be.visible')
  })

  it('translates UI labels and error messages when language is switched to Portuguese', () => {
    // Switch i18n instance to Portuguese prior to mounting with a raw backend error string
    i18n.changeLanguage('pt')

    mount(
      <WeatherCard
        weather={null}
        loading={false}
        error="Unable to find location. Try another search!"
        onSearch={cy.stub()}
        onReset={cy.stub()}
      />
    )

    // Confirm both UI button text and mapped API error message render in Portuguese
    cy.contains('button', 'Buscar').should('be.visible')
    cy.contains('Não foi possível encontrar a localização. Tente outra busca!').should('be.visible')
  })
})