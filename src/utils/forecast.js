const request = require('postman-request')

// // OpenWeather API url
// const url_weather = 'http://api.weatherstack.com/current?access_key=d88b3ad371151906f715613a31e2e292&query=37.0000,-122.0000'
// // WeatherStack API options
// const options = {
//     url: url_weather,
//     json: true // With json option set as true, there is no need to parse stuff with JSON.parse()
// }
// request(options, (error, response) => {
//     // const data = JSON.parse(response.body) // body is where the API response stores values
//     // console.log(data.current) // current stores the info about temperature
//     // console.log("%s. The current temperature is %s, It feels like %s",response.body.current.weather_descriptions[0], response.body.current.temperature, response.body.current.feelslike)
//     //console.log(response.body.current)

//     if (error) {
//         console.log("Unable to fetch data from WeatherStack: %s", error)
//     } else if(response.body.error){
//         console.log("Unable to fetch data:\n%s\n%s", response.body.error.type, response.body.error.info)
//     } else {
//         console.log(response.body.current)
//     }
// })

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat='+ latitude +'&lon=' + longitude + '&units=metric&appid=79e58c9ab2a5edbf0e3bd6708a364732'


    request({ url, json: true }, (error, { body }) => {
        if (error){
            callback('Unable to connect to OpenWeather API!', undefined)
        } else if (body.message){
            callback(body.message, undefined)
        } else {
            const data = {
                weather_description: body.weather[0].description,
                temperature: body.main.temp,
                feels_like: body.main.feels_like,
                humidity: body.main.humidity,
                icon: body.weather[0].icon
            }
            callback(undefined, data)
        }
    })
}

module.exports = forecast