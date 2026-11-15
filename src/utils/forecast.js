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