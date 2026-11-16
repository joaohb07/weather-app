/**
 * @typedef {Object} ForecastResult
 * @property {string} weather_description - Localized textual description of current weather conditions.
 * @property {number} temperature - Current temperature in Celsius.
 * @property {number} feels_like - Perceived temperature in Celsius.
 * @property {number} humidity - Relative air humidity percentage (0–100).
 * @property {string} icon - OpenWeather icon identifier (e.g., "04d", "01n").
 */

/**
 * Fetches current weather telemetry for given coordinates via the OpenWeather Current Weather API.
 *
 * @param {number} latitude - Geographic latitude.
 * @param {number} longitude - Geographic longitude.
 * @param {string} [lang='en'] - Response language code ("en" or "pt").
 * @returns {Promise<ForecastResult>} Normalized weather metrics in Celsius.
 * @throws {Error} When the API key is missing or the upstream request fails/times out.
 */
const forecast = async (latitude, longitude, lang = 'en') => {
    // Validate server API key presence before performing network I/O
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
        throw new Error('OPENWEATHER_API_KEY is not configured on the server.')
    }

    // Whitelist supported language codes to prevent arbitrary query parameter injection
    const safeLang = lang === 'pt' ? 'pt' : 'en'
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=${safeLang}&appid=${apiKey}`

    // Abort request automatically if OpenWeather takes longer than 5 seconds to respond
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const data = await response.json()

    // Propagate upstream API errors (e.g., invalid coordinates or unauthorized API key)
    if (!response.ok) {
        throw new Error(data?.message || 'Unable to connect to OpenWeather API!')
    }

    // Extract and return only the telemetry fields required by the frontend
    return {
        weather_description: data.weather[0].description,
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        icon: data.weather[0].icon
    }
}

module.exports = forecast