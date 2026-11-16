import { useState } from 'react'
import WorldMap from './components/WorldMap'
import WeatherCard from './components/WeatherCard'
import InfoModal from './components/InfoModal'

export default function App() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (address) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/weather?address=${encodeURIComponent(address)}`)
      const data = await response.json()

      if (!response.ok || data.error) {
        setWeather(null)
        setError(data.error || 'Não foi possível obter os dados meteorológicos.')
      } else {
        setWeather(data)
      }
    } catch {
      setWeather(null)
      setError('Falha de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setWeather(null)
    setError(null)
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden font-sans text-slate-100">
      {/* Mapa-múndi interativo ao fundo */}
      <WorldMap
        location={weather}
        temperature={weather?.forecastData?.temperature}
      />

      {/* Camada principal do Card */}
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

      {/* Botão discreto de informações */}
      <InfoModal />
    </main>
  )
}