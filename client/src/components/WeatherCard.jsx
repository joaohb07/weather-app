import { useState } from 'react'
import { Search, MapPin, Thermometer, Droplets, Loader2, RotateCcw, AlertCircle } from 'lucide-react'

export default function WeatherCard({ weather, loading, error, onSearch, onReset }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim() || loading) return
    onSearch(query.trim())
  }

  const handleClear = () => {
    setQuery('')
    onReset()
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl transition-all duration-500">
      {/* Formulário de Busca */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite uma cidade ou país (ex: Porto, Tokyo)..."
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="flex h-[46px] items-center justify-center rounded-xl bg-sky-500 px-4 text-sm font-medium text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
        </button>

        {(weather || error) && (
          <button
            type="button"
            onClick={handleClear}
            title="Resetar mapa"
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-800/60 text-slate-300 transition hover:bg-slate-700/70 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Estado Inicial */}
      {!weather && !error && !loading && (
        <p className="mt-3 text-center text-xs text-slate-400">
          Pesquise qualquer localização para destacar o país no mapa e consultar o clima em tempo real.
        </p>
      )}

      {/* Estado de Erro */}
      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div className="text-xs leading-relaxed">
            <p className="font-semibold text-rose-100">{error}</p>
            <p className="mt-1 text-rose-300/80">Tente buscar pelo nome da cidade ou país em inglês/português.</p>
          </div>
        </div>
      )}

      {/* Resultado Meteorológico */}
      {weather && !error && (
        <div className="mt-6 space-y-5 animate-[fadeIn_0.35s_ease-out]">
          {/* Cabeçalho da Localização */}
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-sky-400">
                <MapPin className="h-3.5 w-3.5" />
                <span>{weather.countryName || 'Localização'}</span>
              </div>
              <h2 className="mt-1 text-lg font-semibold leading-snug text-white">
                {weather.placeName}
              </h2>
            </div>

            <img
              src={`https://openweathermap.org/img/wn/${weather.forecastData.icon}@2x.png`}
              alt={weather.forecastData.weather_description}
              className="h-16 w-16 shrink-0 drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]"
            />
          </div>

          {/* Temperatura Principal */}
          <div className="flex items-baseline justify-between">
            <div className="text-5xl font-bold tracking-tight text-white">
              {Math.round(weather.forecastData.temperature)}
              <span className="text-2xl font-normal text-slate-400">°C</span>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium capitalize text-slate-200">
              {weather.forecastData.weather_description}
            </span>
          </div>

          {/* Métricas Secundárias */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border border-white/5 bg-slate-950/50 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Thermometer className="h-3.5 w-3.5 text-amber-400" />
                <span>Sensação Térmica</span>
              </div>
              <p className="mt-1.5 text-lg font-semibold text-slate-100">
                {weather.forecastData.feels_like.toFixed(1)}°C
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-950/50 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Droplets className="h-3.5 w-3.5 text-sky-400" />
                <span>Umidade</span>
              </div>
              <p className="mt-1.5 text-lg font-semibold text-slate-100">
                {weather.forecastData.humidity}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}