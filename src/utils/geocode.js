const request = require('postman-request')

// OpenCage API Forward Geocoding - transform location to lat,long
// Address -> Location -> Weather
// Address -> Geocoding -> WeatherStack
// To use this API we need places to be URI encoded
// My key = a97976d1565f4a67af878a72a1d3dc3e

const geocode = (address, callback) => {
    const url = 'https://api.opencagedata.com/geocode/v1/json?key=a97976d1565f4a67af878a72a1d3dc3e&q=' + address + '&pretty=1&limit=1'

    request({ url, json: true }, (error, { body }) => {
        if(error){
            callback('Unable to connect to OpenCage API!')
        } else if(body.results.length === 0) {
            callback('Unable to find location. Try another search!')
        } else {
            const data = {
                placeName: body.results[0].formatted,
                latitude: body.results[0].geometry.lat,
                longitude: body.results[0].geometry.lng
            }
            callback(undefined, data)
        }
    })
}

module.exports = geocode