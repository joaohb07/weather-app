//Load Client side JavaScript
console.log("JavaScript Loaded!")

// Select our Weather form
const weatherForm = document.querySelector('form') // Selects form HTML element
const search = document.querySelector('input')
// Select paragraphs to be manipulated
const messageLocation =  document.querySelector('#location')
const messageForecast =  document.querySelector('#forecast-data')
const messageTemp =  document.querySelector('#temp')
const messageFeels =  document.querySelector('#feels')
const messageTempHum =  document.querySelector('#humidity')
// HTML Element to be manipulated
const cardDiv = document.getElementById('card-div')
const messageIcon =  document.getElementById('icon')
const messageIconDiv =  document.getElementById('icon-div')
const messageList =  document.getElementById('list')

messageLocation.textContent = 'Waiting for location...'
messageIconDiv.style.display = 'none'
messageList.style.display = 'none'
// Add event Listener to form, on submit

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault() // Doesn't reload page, as pattern
    
    const location = search.value

    // console.log(location)
    fetch('/weather?address=' + location).then((response) => {
    response.json().then((data) => {
        if (data.error) {
            // console.log(data.error)
            cardDiv.className = "card border-danger text-danger mb-3"
            messageForecast.className = "card-subtitle mb-2 text-muted"
            messageLocation.textContent = data.error
            messageForecast.textContent = 'Try something like: Taiwan'
            messageTemp.textContent = ''
            messageFeels.textContent = ''
            messageTempHum.textContent = ''
            messageIconDiv.style.display = 'none'
            messageList.style.display = 'none'
        } else {
            cardDiv.className = "card border-primary mb-3"
            messageForecast.className = "card-text"
            messageLocation.textContent = data.placeName
            messageForecast.textContent = 'Description: ' + data.forecastData.weather_description
            messageTemp.textContent = 'Temperature: ' + data.forecastData.temperature + '˚C'
            messageFeels.textContent = 'Feels Like: ' + data.forecastData.feels_like + '˚C'
            messageTempHum.textContent = 'Humidity: ' + data.forecastData.humidity + '%'
            messageIconDiv.style.display = 'inline'
            messageList.style.display = 'inline'
            const iconUrl = 'http://openweathermap.org/img/w/' + data.forecastData.icon + '.png'
            messageIcon.src = iconUrl
        }
    })
})
})