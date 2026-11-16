/**
 * @typedef {Object} ForecastResult
 * @property {string} weather_description - Descrição textual da condição climática.
 * @property {number} temperature - Temperatura atual em graus Celsius.
 * @property {number} feels_like - Sensação térmica em graus Celsius.
 * @property {number} humidity - Umidade relativa do ar (%).
 * @property {string} icon - Código do ícone meteorológico do OpenWeather.
 */

/**
 * Obtém a previsão do tempo atual a partir de coordenadas via OpenWeather API.
 *
 * @param {number} latitude - Latitude geográfica.
 * @param {number} longitude - Longitude geográfica.
 * @returns {Promise<ForecastResult>} Métricas climáticas atuais em unidades métricas.
 * @throws {Error} Quando a chave de API está ausente ou a requisição externa falha.
 */
const forecast = async (latitude, longitude) => {
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
        throw new Error('OPENWEATHER_API_KEY is not configured on the server.')
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`

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