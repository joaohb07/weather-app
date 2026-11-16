const fs = require('fs')
const path = require('path')
const request = require('supertest')
const app = require('../../src/app')
const geocode = require('../../src/utils/geocode')
const forecast = require('../../src/utils/forecast')

// Auto-mock utility modules so HTTP route tests evaluate Express routing,
// input validation, and orchestration logic in isolation from external APIs
jest.mock('../../src/utils/geocode')
jest.mock('../../src/utils/forecast')

/**
 * Integration test suite for the `GET /weather` REST endpoint using Supertest.
 */
describe('GET /weather endpoint', () => {
    it('should return 400 when address query param is missing', async () => {
        const res = await request(app).get('/weather')

        expect(res.status).toBe(400)
        expect(res.body).toEqual({
            error: 'You must provide a valid location!'
        })
        // Ensure no downstream API calls are wasted when validation fails
        expect(geocode).not.toHaveBeenCalled()
    })

    it('should return 400 when address query param contains only whitespace', async () => {
        const res = await request(app).get('/weather?address=%20%20%20')

        expect(res.status).toBe(400)
        expect(res.body).toEqual({
            error: 'You must provide a valid location!'
        })
    })

    it('should return 200 with combined location and forecast data for valid address', async () => {
        const mockLocation = {
            placeName: 'Barcelona, Catalonia, Spain',
            latitude: 41.3874,
            longitude: 2.1686,
            countryCode: 'ESP',
            countryName: 'Spain'
        }

        const mockForecast = {
            weather_description: 'few clouds',
            temperature: 16.4,
            feels_like: 15.5,
            humidity: 66,
            icon: '02d'
        }

        geocode.mockResolvedValue(mockLocation)
        forecast.mockResolvedValue(mockForecast)

        // Pass padded whitespace to verify Express trims `address` before calling `geocode`
        const res = await request(app).get('/weather?address=  Barcelona  ')

        expect(res.status).toBe(200)
        expect(geocode).toHaveBeenCalledWith('Barcelona')
        expect(forecast).toHaveBeenCalledWith(41.3874, 2.1686, 'en')
        expect(res.body).toEqual({
            ...mockLocation,
            forecastData: mockForecast
        })
    })

    it('should return 400 when geocode throws an error and skip forecast call', async () => {
        geocode.mockRejectedValue(new Error('Unable to find location. Try another search!'))

        const res = await request(app).get('/weather?address=NowhereXYZ')

        expect(res.status).toBe(400)
        expect(res.body).toEqual({
            error: 'Unable to find location. Try another search!'
        })
        // Short-circuit verification: `forecast` must not be invoked if `geocode` fails
        expect(forecast).not.toHaveBeenCalled()
    })

    it('should return 400 when forecast throws an error', async () => {
        geocode.mockResolvedValue({
            placeName: 'Tokyo, Japan',
            latitude: 35.6762,
            longitude: 139.6503,
            countryCode: 'JPN',
            countryName: 'Japan'
        })
        forecast.mockRejectedValue(new Error('Unable to connect to OpenWeather API!'))

        const res = await request(app).get('/weather?address=Tokyo')

        expect(res.status).toBe(400)
        expect(res.body).toEqual({
            error: 'Unable to connect to OpenWeather API!'
        })
    })

    it('should fallback to default error message when thrown error has no message', async () => {
        geocode.mockRejectedValue({})

        const res = await request(app).get('/weather?address=Lisbon')

        expect(res.status).toBe(400)
        expect(res.body).toEqual({
            error: 'Unable to fetch weather data.'
        })
    })
})

/**
 * Integration test suite verifying Express's dual-mode fallback routing
 * (Development API-only mode vs. Production SPA static file serving).
 */
describe('Wildcard & static frontend routes', () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should return API status message on unknown route when client/dist is absent', async () => {
        const res = await request(app).get('/unknown-page')

        expect(res.status).toBe(200)
        expect(res.text).toContain('API running on port 3000')
    })

    it('should serve index.html on wildcard route when client/dist exists', async () => {
        // Simulate production build environment where `client/dist` exists on disk
        jest.spyOn(fs, 'existsSync').mockReturnValue(true)

        let prodApp
        let sendFileSpy

        // Use `jest.isolateModules` so `src/app.js` re-evaluates its top-level
        // `fs.existsSync(clientDistPath)` check in a fresh module registry
        jest.isolateModules(() => {
            const isolatedExpress = require('express')
            sendFileSpy = jest
                .spyOn(isolatedExpress.response, 'sendFile')
                .mockImplementation(function () {
                    this.status(200).send('<!doctype html><html><body>React App</body></html>')
                })
            prodApp = require('../../src/app')
        })

        const res = await request(prodApp).get('/any-spa-route')

        expect(res.status).toBe(200)
        expect(res.text).toContain('React App')
        expect(sendFileSpy).toHaveBeenCalledWith(
            expect.stringContaining(path.join('client', 'dist', 'index.html'))
        )
    })
})