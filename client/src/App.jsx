import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import WorldMap from './components/WorldMap'
import WeatherCard from './components/WeatherCard'
import InfoModal from './components/InfoModal'
import LanguageToggle from './components/LanguageToggle'

/**
 * Root application component coordinating state across the interactive world map,
 * weather search card, info modal, and language switcher.
 */
export default function App() {
  // Access the i18next instance to read the currently active UI locale
  const { i18n } = useTranslation()

  // Application state:
  // - weather: stores the combined geocoding + forecast payload from `/weather`
  // - lastQuery: remembers the most recent searched city so it can be re-fetched on language switch
  // - loading: tracks in-flight HTTP requests to show spinner states and disable duplicate submits
  // - error: holds API or network error keys/messages for localized display
  const [weather, setWeather] = useState(null)
  const [lastQuery, setLastQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Normalize locale variants (e.g., 'pt-BR', 'pt-PT') into the two supported backend codes ('pt' | 'en')
  const currentLang = i18n.language?.startsWith('pt') ? 'pt' : 'en'

  /**
   * Fetches geolocation and weather telemetry from the Express backend.
   *
   * Why `useCallback`?
   * Memoizes the function reference across re-renders so it does not get recreated
   * on every state update and can be safely referenced inside effects without
   * triggering unintended re-executions.
   *
   * @param {string} address - User-provided city or location string.
   * @param {'en'|'pt'} lang - Target language code for localized weather descriptions.
   */
  const fetchWeather = useCallback(async (address, lang) => {
    setLoading(true)
    setError(null)

    try {
      // Relative path (`weather?...` without a leading slash) ensures compatibility
      // both at root (`/`) in local dev and under subpath (`/weather-app/`) in production
      const response = await fetch(
        `weather?address=${encodeURIComponent(address)}&lang=${lang}`
      )
      const data = await response.json()

      // Handle HTTP error statuses (400/500) or application-level error payloads
      if (!response.ok || data.error) {
        setWeather(null)
        setError(data.error || 'GENERIC_ERROR')
      } else {
        setWeather(data)
      }
    } catch {
      // Catch network-level failures (offline, DNS failure, server unreachable)
      setWeather(null)
      setError('NETWORK_ERROR')
    } finally {
      // Always clear the loading indicator regardless of success or failure
      setLoading(false)
    }
  }, [])

  /**
   * Handler passed down to `WeatherCard` when the user submits a new location search.
   */
  const handleSearch = (address) => {
    setLastQuery(address)
    fetchWeather(address, currentLang)
  }

  /**
   * Side effect that automatically re-fetches weather data in the newly selected language
   * whenever the user toggles between EN and PT while a location result is already displayed.
   */
  useEffect(() => {
    if (lastQuery && weather) {
      fetchWeather(lastQuery, currentLang)
    }
    // Intentionally scoped to `currentLang` so typing or weather updates don't re-trigger this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang])

  /**
   * Clears active search results and errors, returning the map and card to their initial state.
   */
  const handleReset = () => {
    setWeather(null)
    setLastQuery('')
    setError(null)
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden font-sans text-slate-100">
      {/* Full-viewport interactive vector world map rendered in the background layer (z-0) */}
      <WorldMap
        location={weather}
        temperature={weather?.forecastData?.temperature}
      />

      {/* Top-centered floating pill for switching between English and Portuguese */}
      <LanguageToggle />

      {/* Main foreground layout (z-10): centers the card initially, then shifts it left on desktop
          once a location is active so the zoomed-in country remains clearly visible on the right */}
      <div
        className={`relative z-10 flex h-full w-full items-center p-4 sm:p-8 transition-all duration-700 ${
          weather ? 'justify-center lg:justify-start lg:pl-16' : 'justify-center'
        }`}
      >
        <WeatherCard
          weather={weather}
          loading={loading}
          error={error}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </div>

      {/* Bottom-right floating trigger and modal with project metadata and links */}
      <InfoModal />
    </main>
  )
}