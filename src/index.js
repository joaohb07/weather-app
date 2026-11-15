const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

const publicDir = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDir))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'joaohb07'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About App',
        name: 'joaohb07'
    })
})

app.get('/weather', async (req, res) => {
    const address = req.query.address?.trim()

    if (!address) {
        return res.status(400).send({
            error: 'You must provide a valid location!'
        })
    }

    try {
        const { latitude, longitude, placeName } = await geocode(address)
        const forecastData = await forecast(latitude, longitude)

        return res.send({
            placeName,
            forecastData
        })
    } catch (error) {
        return res.status(400).send({
            error: error.message || 'Unable to fetch weather data.'
        })
    }
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        message: 'Page not found!',
        name: 'joaohb07'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})