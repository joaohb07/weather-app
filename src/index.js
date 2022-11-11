const path = require('path') // use path, standard Node.js lib
const express = require('express') // use express js, to create web server
const hbs = require('hbs') // use hbs (handeblars.js), to create dinamic html templates
// handlebars.js is the same as hbs npmjs lib but w/ integration w/ express
// Require utils files - API calls
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// css, js, img paths
const publicDir = path.join(__dirname, '../public') // Define `public` folder path
// console.log(publicDir)

// hbs dinamic templates
const viewsPath = path.join(__dirname, '../templates/views') // Define `views` folder path
// console.log(viewsPath)
const partialsPath = path.join(__dirname, '../templates/partials') // Define `partials` folder path
// console.log(partialsPath)


// Initialize app
const app = express()

// Set up express view engine 
// Using handlebars.js(hbs npmjs lib - integration w/ express)
app.set('view engine', 'hbs')
// Uses `views` folder as pattern, will change to `templates`
app.set('views', viewsPath)
// hbs method to register a partials dir
hbs.registerPartials(partialsPath)

// Set public dir exposure
app.use(express.static(publicDir))

// Define index route
app.get('', (req,res) => {
    res.render('index', { // send an object with essencial information
        title: 'Weather App',
        name: 'joaohb07'
    })
})

// Define route for help page
// app.get('/help', (req,res) => {
//     res.render('help',{ // send an object with essencial information
//         title: 'Help',
//         message:'Helpful value',
//         name: 'joaohb07'
//     })
// })

// Define route for about page
app.get('/about', (req,res) => {
    res.render('about', { // send an object with essencial information
        title: 'About App',
        name: 'joaohb07'
    })
})


// Define route for weather page
app.get('/weather', (req,res) => {
    // console.log(req.query) // see what we receive from query strings 
    if (!req.query.address){
        return res.send({
            error: 'You must provide valid location!'
        })
    } else {
        //Use API Calls
        //Geocode - 1 arg: URL Encoded location, 2 arg: Returns latitude, longitude and place_name
        geocode(encodeURIComponent(req.query.address), (error, {latitude, longitude, placeName} = {}) => {
            if(error){
                return res.send({
                    error // Send API Call Error
                })
            }
            //OpenWeather - 1,2 arg: Receives latitude and longitude, 3 arg: Returns forecastData
            forecast(latitude, longitude, (error, forecastData) => {
                if (error){
                    return res.send({
                        error // Send API Call Error
                    })
                }
                
                // Finally, send as response, an object w/ place_name and forecastData
                return res.send({
                    placeName,
                    forecastData
                })
            })
        })
    }
})

// Define route for products test page
// app.get('/products', (req,res) => {
//     // console.log(req.query) // see what we receive from query strings 
//     if (!req.query.search){
//         return res.send({
//             error: 'You must provide a search term'
//         })
//     }

//     res.send({ // send an object with essencial information
//         products: []
//     })
// })


// Define a route for everything else, a 404 page
app.get('*', (req,res) => { // `*` - express wildcard
    res.render('404',{
        title: '404',
        message: 'Page not found!',
        name: 'joaohb07'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})