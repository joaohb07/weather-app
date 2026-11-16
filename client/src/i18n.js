import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const resources = {
  en: {
    translation: {
      searchPlaceholder: 'Type a city or country (e.g., Porto, Tokyo)...',
      searchButton: 'Search',
      resetTooltip: 'Reset map',
      initialHelper: 'Search any location to highlight the country on the map and check real-time weather.',
      defaultLocationLabel: 'Location',
      feelsLike: 'Feels Like',
      humidity: 'Humidity',
      errorHint: 'Try searching by city or country name in English or Portuguese.',
      infoAriaLabel: 'About the project',
      modalTitle: 'Weather App',
      modalDescription:
        'Full Stack application built with React, Tailwind CSS, D3-Geo, and Node.js/Express, integrating geocoding (OpenCage) and real-time weather data (OpenWeather).',
      githubLink: 'GitHub Repository',
      docsLink: 'Documentation',
      developedBy: 'Developed by joaohb07',
      errors: {
        invalidLocation: 'You must provide a valid location!',
        notFound: 'Unable to find location. Try another search!',
        geocodeFailed: 'Unable to connect to OpenCage API!',
        forecastFailed: 'Unable to connect to OpenWeather API!',
        networkError: 'Failed to connect to the server.',
        generic: 'Unable to fetch weather data.'
      }
    }
  },
  pt: {
    translation: {
      searchPlaceholder: 'Digite uma cidade ou país (ex: Porto, Tokyo)...',
      searchButton: 'Buscar',
      resetTooltip: 'Resetar mapa',
      initialHelper: 'Pesquise qualquer localização para destacar o país no mapa e consultar o clima em tempo real.',
      defaultLocationLabel: 'Localização',
      feelsLike: 'Sensação Térmica',
      humidity: 'Umidade',
      errorHint: 'Tente buscar pelo nome da cidade ou país em inglês ou português.',
      infoAriaLabel: 'Sobre o projeto',
      modalTitle: 'Weather App',
      modalDescription:
        'Aplicação Full Stack desenvolvida com React, Tailwind CSS, D3-Geo e Node.js/Express, integrando geocodificação (OpenCage) e dados meteorológicos em tempo real (OpenWeather).',
      githubLink: 'Repositório no GitHub',
      docsLink: 'Documentação',
      developedBy: 'Desenvolvido por joaohb07',
      errors: {
        invalidLocation: 'Você deve informar uma localização válida!',
        notFound: 'Não foi possível encontrar a localização. Tente outra busca!',
        geocodeFailed: 'Não foi possível conectar à API do OpenCage!',
        forecastFailed: 'Não foi possível conectar à API do OpenWeather!',
        networkError: 'Falha de conexão com o servidor.',
        generic: 'Não foi possível obter os dados meteorológicos.'
      }
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n