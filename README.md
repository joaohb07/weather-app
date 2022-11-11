# Weather App

> Check out weather information about a specific location!

A weather app using [**Node.js**](https://nodejs.org/en/). To run this locally, make sure you have this installed.

## Documentation

Access my official projects [**documentation**](https://joaohb07.github.io/documentation/).

## Installation

To install dependencies to run this code locally, follow these steps:

1. Clone `main` branch from this repo:

    ```bash
    git clone <repo-url>
    cd weather-app
    ```

2. Use npm package to install dependencies:

    ```bash
    npm install # or, npm i
    ```

## Usage

To run the app, execute the following command:

```bash
nodemon src/index.js -e js,hbs
```

Access in your favorite web browser `localhost:3000`.

## Technologies

To fetch location and weather data, I used APIs that do this job.

### APIs

#### Geocode API

To use geolocation info, such as, latitude and longitude from a specified location I used [***OpenCage Data API***](https://opencagedata.com/api#quickstart).

#### Weather API

To use real time info about weather, I used [***OpenWeather Map API***](https://openweathermap.org/current).

### Libs

I used the following npm libs to develop this app:

1. [Express](https://expressjs.com/) - For creating a web server.
2. [Hbs](https://www.npmjs.com/package/hbs) - Handlebars for custom dinamic HTML views.
3. [Postman Request](https://www.npmjs.com/package/postman-request) - To make a request to the APIs.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
