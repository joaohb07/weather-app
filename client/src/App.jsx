import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import WorldMap from './components/WorldMap'
import WeatherCard from './components/WeatherCard'
import InfoModal from './components/InfoModal'
import LanguageToggle from './components/LanguageToggle'

/**
 * Root application component coordinating the world map, weather card, and language switcher.
 */
export default function App() {
  const { i18n } = useTranslation()
  const [weather, setWeather] = useState(null)
  const [lastQuery, setLastQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const currentLang = i18n.language?.startsWith('pt') ? 'pt' : 'en'

  const fetchWeather = useCallback(async (address, lang) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/weather?address=${encodeURIComponent(address)}&lang=${lang}`
      )
      const data = await response.json()

      if (!response.ok || data.error) {
        setWeather(null)
        setError(data.error || 'GENERIC_ERROR')
      } else {
        setWeather(data)
      }
    } catch {
      setWeather(null)
      setError('NETWORK_ERROR')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = (address) => {
    setLastQuery(address)
    fetchWeather(address, currentLang)
  }

  // Refresh weather description when language toggles while a location is active
  useEffect(() => {
    if (lastQuery && weather) {
      fetchWeather(lastQuery, currentLang)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang])

  const handleReset = () => {
    setWeather(null)
    setLastQuery('')
    setError(null)
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden font-sans text-slate-100">
      {/* Interactive vector world map background */}
      <WorldMap
        location={weather}
        temperature={weather?.forecastData?.temperature}
      />

      {/* Top floating language pill */}
      <LanguageToggle />

      {/* Main floating weather card container */}
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

      {/* Bottom-right project info modal */}
      <InfoModal />
    </main>
  )
}