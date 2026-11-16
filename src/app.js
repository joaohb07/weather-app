const fs = require('fs')
const path = require('path')
const express = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const clientDistPath = path.join(__dirname, '../client/dist')

/**
 * Rota de consulta meteorológica.
 * Recebe `address` via query string, resolve coordenadas e retorna o clima atual.
 */
app.get('/weather', async (req, res) => {
    const address = req.query.address?.trim()

    if (!address) {
        return res.status(400).send({
            error: 'You must provide a valid location!'
        })
    }

    try {
        const locationData = await geocode(address)
        const forecastData = await forecast(locationData.latitude, locationData.longitude)

        return res.send({
            ...locationData,
            forecastData
        })
    } catch (error) {
        return res.status(400).send({
            error: error.message || 'Unable to fetch weather data.'
        })
    }
})

// Entrega o build estático do frontend React quando disponível
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