import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

/**
 * Translation dictionaries for supported application locales (`en` and `pt`).
 * Exported directly so Cypress Component tests can inject `i18n` without network loading.
 */
export const resources = {
  en: {
    translation: {
      // Search & Map Controls
      searchPlaceholder: 'Type a city or country (e.g., Porto, Tokyo)...',
      searchButton: 'Search',
      resetTooltip: 'Reset map',
      initialHelper: 'Search any location to highlight the country on the map and check real-time weather.',

      // Weather Card Labels
      defaultLocationLabel: 'Location',
      localTime: 'Local time',
      feelsLike: 'Feels Like',
      humidity: 'Humidity',
      errorHint: 'Try searching by city or country name in English or Portuguese.',

      // Project Info Modal
      infoAriaLabel: 'About the project',
      modalTitle: 'Weather App',
      modalDescription:
        'Full Stack application built with React, Tailwind CSS, D3-Geo, and Node.js/Express, integrating geocoding (OpenCage) and real-time weather data (OpenWeather).',
      githubLink: 'GitHub Repository',
      docsLink: 'Documentation',
      developedBy: 'Developed by joaohb07',

      // Normalized Error Messages (mapped from backend responses in App.jsx)
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
      // Search & Map Controls
      searchPlaceholder: 'Digite uma cidade ou país (ex: Porto, Tokyo)...',
      searchButton: 'Buscar',
      resetTooltip: 'Resetar mapa',
      initialHelper: 'Pesquise qualquer localização para destacar o país no mapa e consultar o clima em tempo real.',

      // Weather Card Labels
      defaultLocationLabel: 'Localização',
      localTime: 'Horário local',
      feelsLike: 'Sensação Térmica',
      humidity: 'Umidade',
      errorHint: 'Tente buscar pelo nome da cidade ou país em inglês ou português.',

      // Project Info Modal
      infoAriaLabel: 'Sobre o projeto',
      modalTitle: 'Weather App',
      modalDescription:
        'Aplicação Full Stack desenvolvida com React, Tailwind CSS, D3-Geo e Node.js/Express, integrando geocodificação (OpenCage) e dados meteorológicos em tempo real (OpenWeather).',
      githubLink: 'Repositório no GitHub',
      docsLink: 'Documentação',
      developedBy: 'Desenvolvido by joaohb07',

      // Normalized Error Messages (mapped from backend responses in App.jsx)
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

// Initialize i18next instance and bind it to React's context layer
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default startup locale
  fallbackLng: 'en', // Fallback locale if a translation key is missing
  interpolation: {
    // React already escapes interpolated values against XSS, so disable double-escaping
    escapeValue: false
  }
})

export default i18n