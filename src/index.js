const path = require('path')
const express = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

const clientDistPath = path.join(__dirname, '../client/dist')

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

// Serve o frontend React compilado em produção
app.use(express.static(clientDistPath))

app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'))
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})