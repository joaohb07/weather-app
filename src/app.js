const fs = require('fs')
const path = require('path')
const express = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// Initialize Express application instance.
// Kept decoupled from `app.listen()` (which lives in `src/index.js`) so Supertest
// can import `app` directly in Jest integration tests without binding to a network port.
const app = express()

// Resolve absolute path to the compiled React/Vite production bundle
const clientDistPath = path.join(__dirname, '../client/dist')

/**
 * GET /weather
 * Orchestrates a two-step asynchronous pipeline:
 * 1. Resolves a human-readable address into geographic coordinates via OpenCage.
 * 2. Fetches localized real-time weather telemetry for those coordinates via OpenWeather.
 *
 * Query Parameters:
 * - `address` (required): City, region, or landmark string.
 * - `lang` (optional): Response language code ('en' | 'pt'), defaults to 'en'.
 */
app.get('/weather', async (req, res) => {
    // Sanitize query inputs: trim whitespace and strictly whitelist supported locales
    const address = req.query.address?.trim()
    const lang = req.query.lang === 'pt' ? 'pt' : 'en'

    // Guard clause: fail fast with 400 Bad Request before making external API calls
    if (!address) {
        return res.status(400).send({
            error: 'You must provide a valid location!'
        })
    }

    try {
        // Step 1: Forward geocoding (text address -> latitude, longitude, ISO country metadata)
        const locationData = await geocode(address)

        // Step 2: Weather lookup using resolved coordinates and requested locale
        const forecastData = await forecast(locationData.latitude, locationData.longitude, lang)

        // Merge geocoding metadata and forecast metrics into a unified JSON payload
        return res.send({
            ...locationData,
            forecastData
        })
    } catch (error) {
        // Surface domain or upstream API errors cleanly to the client
        return res.status(400).send({
            error: error.message || 'Unable to fetch weather data.'
        })
    }
})

/**
 * Static Frontend & Single-Page Application (SPA) Routing
 *
 * Dual-mode behavior:
 * - Production (Docker): `client/dist` exists from the multi-stage build, so Express
 *   serves compiled static assets and falls back to `index.html` for client-side routes.
 * - Development: `client/dist` is absent; Express acts purely as a JSON API server while
 *   Vite serves the frontend on port 5173 with a dev proxy.
 */
if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath))

    app.get('*', (req, res) => {
        res.sendFile(path.join(clientDistPath, 'index.html'))
    })
} else {
    app.get('*', (req, res) => {
        res.status(200).send('API running on port 3000. Frontend dev server available at http://localhost:5173')
    })
}

module.exports = app