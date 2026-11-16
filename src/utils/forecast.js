/**
 * @typedef {Object} ForecastResult
 * @property {string} weather_description - Textual description of current weather conditions.
 * @property {number} temperature - Current temperature in Celsius.
 * @property {number} feels_like - Perceived temperature in Celsius.
 * @property {number} humidity - Relative air humidity percentage.
 * @property {string} icon - OpenWeather icon identifier.
 */

/**
 * Fetches current weather conditions from coordinates via OpenWeather API.
 *
 * @param {number} latitude - Geographic latitude.
 * @param {number} longitude - Geographic longitude.
 * @param {string} [lang='en'] - Response language code ("en" or "pt").
 * @returns {Promise<ForecastResult>} Current weather metrics in metric units.
 * @throws {Error} When the API key is missing or the external request fails.
 */
const forecast = async (latitude, longitude, lang = 'en') => {
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
        throw new Error('OPENWEATHER_API_KEY is not configured on the server.')
    }

    const safeLang = lang === 'pt' ? 'pt' : 'en'
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=${safeLang}&appid=${apiKey}`

    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.message || 'Unable to connect to OpenWeather API!')
    }

    return {
        weather_description: data.weather[0].description,
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        icon: data.weather[0].icon
    }
}

module.exports = forecast