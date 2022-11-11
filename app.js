// Express - for Web Server
const express = require('express')
// Initializing Web Server
const app = express()

// Dirname and Filename - Pure JS
// console.log(__dirname)
// console.log(__filename)

// Using Node.js Path module
const path = require('path')
console.log(path.join(__dirname, '../'))

// Require utils files - API calls
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// Provide proccess as argument
// console.log(process.argv)
const place = process.argv[2]

if (!place) {
    console.log("Invalid Place provided")
} else {
    geocode(encodeURIComponent(place), (error, {latitude, longitude, place_name} = {}) => {
        if(error){
            return console.log(error)
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error){
                return console.log(error)
            }
            
            console.log(place_name)
            console.log(forecastData)
        })
    })
}