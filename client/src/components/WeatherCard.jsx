import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, MapPin, Thermometer, Droplets, Loader2, RotateCcw, AlertCircle } from 'lucide-react'

/**
 * Maps raw English error strings returned by the Express backend or network layer
 * into i18n translation keys so error messages dynamically adapt to EN/PT.
 */
const ERROR_TRANSLATION_MAP = {
  'You must provide a valid location!': 'errors.invalidLocation',
  'Unable to find location. Try another search!': 'errors.notFound',
  'Unable to connect to OpenCage API!': 'errors.geocodeFailed',
  'Unable to connect to OpenWeather API!': 'errors.forecastFailed',
  NETWORK_ERROR: 'errors.networkError',
  GENERIC_ERROR: 'errors.generic'
}

/**
 * Floating glassmorphic card handling location search input, weather metrics display,
 * loading states, and localized error feedback.
 *
 * @param {Object} props
 * @param {Object|null} props.weather - Combined geolocation and weather forecast payload.
 * @param {boolean} props.loading - Indicates whether an API request is currently in flight.
 * @param {string|null} props.error - Raw error string or error code from failed requests.
 * @param {(address: string) => void} props.onSearch - Callback triggered with trimmed query on submit.
 * @param {() => void} props.onReset - Callback triggered when the user resets the search state.
 */
export default function WeatherCard({ weather, loading, error, onSearch, onReset }) {
  const { t } = useTranslation()

  // Controlled input state for the search text field
  const [query, setQuery] = useState('')

  /**
   * Handles form submission, preventing full-page browser reload and guarding
   * against empty whitespace submissions or duplicate requests while loading.
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim() || loading) return
    onSearch(query.trim())
  }

  /**
   * Clears the local search input and notifies the parent `App` component to reset map/weather state.
   */
  const handleClear = () => {
    setQuery('')
    onReset()
  }

  // Resolve backend error messages into localized strings, falling back to the raw message if unmapped
  const translatedError = error
    ? ERROR_TRANSLATION_MAP[error]
      ? t(ERROR_TRANSLATION_MAP[error])
      : error
    : null

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl transition-all duration-500">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
          />
        </div>

        {/* Primary submit button: displays an animated spinner while `loading` is true */}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="flex h-[46px] items-center justify-center rounded-xl bg-sky-500 px-4 text-sm font-medium text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('searchButton')}
        </button>

        {/* Conditional reset button: rendered only when an active result or error exists */}
        {(weather || error) && (
          <button
            type="button"
            onClick={handleClear}
            title={t('resetTooltip')}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-800/60 text-slate-300 transition hover:bg-slate-700/70 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Initial Helper State: shown on first load before any search is performed */}
      {!weather && !error && !loading && (
        <p className="mt-3 text-center text-xs text-slate-400">
          {t('initialHelper')}
        </p>
      )}

      {/* Error State Banner */}
      {translatedError && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div className="text-xs leading-relaxed">
            <p className="font-semibold text-rose-100">{translatedError}</p>
            <p className="mt-1 text-rose-300/80">{t('errorHint')}</p>
          </div>
        </div>
      )}

      {/* Weather Forecast Result Panel */}
      {weather && !error && (
        <div className="mt-6 space-y-5 animate-[fadeIn_0.35s_ease-out]">
          {/* Location header (Country + Formatted Place Name + OpenWeather condition icon) */}
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-sky-400">
                <MapPin className="h-3.5 w-3.5" />
                <span>{weather.countryName || t('defaultLocationLabel')}</span>
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

          {/* Primary temperature readout and condition badge */}
          <div className="flex items-baseline justify-between">
            <div className="text-5xl font-bold tracking-tight text-white">
              {Math.round(weather.forecastData.temperature)}
              <span className="text-2xl font-normal text-slate-400">°C</span>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium capitalize text-slate-200">
              {weather.forecastData.weather_description}
            </span>
          </div>

          {/* Secondary telemetry cards: Feels-Like temperature and Relative Humidity */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border border-white/5 bg-slate-950/50 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Thermometer className="h-3.5 w-3.5 text-amber-400" />
                <span>{t('feelsLike')}</span>
              </div>
              <p className="mt-1.5 text-lg font-semibold text-slate-100">
                {weather.forecastData.feels_like.toFixed(1)}°C
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-950/50 p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Droplets className="h-3.5 w-3.5 text-sky-400" />
                <span>{t('humidity')}</span>
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