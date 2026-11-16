const forecast = require('../../src/utils/forecast')

/**
 * Unit test suite for the `forecast` utility.
 * Stubs `global.fetch` and isolates `process.env` to verify URL construction,
 * payload normalization, and upstream error handling without external network calls.
 */
describe('forecast utility', () => {
    // Snapshot original environment variables so mutations don't leak across test suites
    const originalEnv = process.env

    beforeEach(() => {
        process.env = { ...originalEnv, OPENWEATHER_API_KEY: 'test-openweather-key' }
    })

    afterEach(() => {
        process.env = originalEnv
        jest.restoreAllMocks()
    })

    it('should throw an error when OPENWEATHER_API_KEY is missing', async () => {
        delete process.env.OPENWEATHER_API_KEY

        await expect(forecast(41.15, -8.61)).rejects.toThrow(
            'OPENWEATHER_API_KEY is not configured on the server.'
        )
    })

    it('should return normalized weather forecast data for valid coordinates', async () => {
        const mockWeatherResponse = {
            weather: [{ description: 'broken clouds', icon: '04d' }],
            main: {
                temp: 17.2,
                feels_like: 16.9,
                humidity: 82
            }
        }

        // Spy on native `fetch` and resolve with a simulated HTTP 200 payload
        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => mockWeatherResponse
        })

        const result = await forecast(41.15, -8.61)

        // Verify query parameters (metric units, default 'en' lang, API key) and AbortSignal timeout
        expect(fetchSpy).toHaveBeenCalledWith(
            'https://api.openweathermap.org/data/2.5/weather?lat=41.15&lon=-8.61&units=metric&lang=en&appid=test-openweather-key',
            { signal: expect.any(AbortSignal) }
        )

        // Verify output matches the normalized `ForecastResult` schema
        expect(result).toEqual({
            weather_description: 'broken clouds',
            temperature: 17.2,
            feels_like: 16.9,
            humidity: 82,
            icon: '04d'
        })
    })

    it('should throw OpenWeather error message when response is not OK', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: false,
            json: async () => ({ message: 'Invalid API key' })
        })

        await expect(forecast(41.15, -8.61)).rejects.toThrow('Invalid API key')
    })

    it('should fallback to default message when API error has no message field', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: false,
            json: async () => ({})
        })

        await expect(forecast(41.15, -8.61)).rejects.toThrow(
            'Unable to connect to OpenWeather API!'
        )
    })

    it('should propagate network errors from fetch', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Socket hang up'))

        await expect(forecast(41.15, -8.61)).rejects.toThrow('Socket hang up')
    })
})