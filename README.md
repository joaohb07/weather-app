<p align="center">
    <img src="client/public/weather.png" height="75" alt="Weather App Icon">
    <h1 align="center"><b>Weather App</b></h1>
</p>

<p align="center">
  <a href="https://jhbserver.tail4bcb71.ts.net/weather-app/">
    <img alt="Live Preview" src="https://badgen.net/badge/icon/Live%20Preview?icon=terminal&label=Self-Hosted&color=blue" />
  </a>
</p>

> Check out real-time weather forecasts and interactive global map visualizations for any location around the world!

A Full Stack weather application built with **Node.js**, **Express**, and **React (Vite + Tailwind CSS)**, featuring multilingual support (`EN` / `PT`), interactive `d3-geo` map visualization, automated testing (**Jest** & **Cypress**), and containerized deployment with **Docker**.

## Live Preview

Check out the [***Live App***](https://jhbserver.tail4bcb71.ts.net/weather-app/) self-hosted via Docker and Tailscale Funnel.

## Documentation

Access my official projects [**documentation**](https://joaohb07.github.io/documentation/).

## Prerequisites

* **Node.js** (v20+ or v22+) & **npm** — for local development without Docker
* **Docker** & **Docker Compose** — for containerized execution
* API Keys for [OpenCage Geocoding](https://opencagedata.com/) and [OpenWeather](https://openweathermap.org/)

## Installation & Environment Setup

1. Clone the repository:

    ```bash
    git clone [https://github.com/joaohb07/weather-app.git](https://github.com/joaohb07/weather-app.git)
    cd weather-app
    ```

2. Create a `.env` file in the root directory and configure your API keys:

    ```env
    PORT=3000
    OPENCAGE_API_KEY=your_opencage_api_key
    OPENWEATHER_API_KEY=your_openweather_api_key
    ```

## Running with Docker (Recommended)

The `Dockerfile` uses a multi-stage build that compiles the React frontend (`client/dist`) and serves both the static UI and the REST API through Express on a single container.

1. Ensure the external proxy network exists (or remove the external network requirement for standalone local testing):

    ```bash
    docker network create global-proxy
    ```

2. Build and start the container in detached mode:

    ```bash
    docker compose up -d --build
    ```

3. Verify container status and logs:

    ```bash
    docker ps
    docker logs weather-app
    ```

*(Note: If running locally without a reverse proxy, uncomment the `ports: - "3000:3000"` section in `docker-compose.yml` and access `http://localhost:3000`.)*

## Running Locally (Without Docker)

1. Install dependencies for both backend and frontend:

    ```bash
    # Install backend dependencies
    npm install

    # Install frontend dependencies
    cd client && npm install && cd ..
    ```

2. Start the backend API server (runs on `http://localhost:3000`):

    ```bash
    npm run dev
    ```

3. In a separate terminal, start the Vite frontend dev server (runs on `http://localhost:5173` with automatic `/weather` proxy to port `3000`):

    ```bash
    cd client
    npm run dev
    ```

4. Open `http://localhost:5173` in your browser.

## Testing

The project includes automated unit/integration tests for the backend and component/end-to-end tests for the frontend.

### Backend Tests (Jest)

Run unit and API route tests from the root directory:

```bash
npm run test

```

### Frontend E2E & Component Tests (Cypress)

1. Make sure the local dev server is running (`http://localhost:5173`), then open the interactive Cypress Test Runner:
```bash
cd client
npm cy:open

```


2. Or run all E2E tests headlessly in the terminal:
```bash
cd client
npm cy:run

```


3. To run component tests headlessly:
```bash
cd client
npm cy:component

```



## Technologies

### APIs

* **[OpenCage Data API](https://opencagedata.com/api#quickstart)** — Forward geocoding to resolve city/location names into latitude and longitude coordinates.
* **[OpenWeather Map API](https://openweathermap.org/current)** — Real-time weather forecast data with localization support.

### Stack & Libraries

* **Backend:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [dotenv](https://www.npmjs.com/package/dotenv)
* **Frontend:** [React](https://react.dev/), [Vite](https://vite.dev/), [Tailwind CSS](https://tailwindcss.com/), [i18next](https://www.i18next.com/) (`react-i18next`), [d3-geo](https://d3js.org/d3-geo)
* **Testing:** [Jest](https://jestjs.io/), [Supertest](https://www.npmjs.com/package/supertest), [Cypress](https://www.cypress.io/)
* **Infrastructure & DevOps:** [Docker](https://www.docker.com/), [Nginx Proxy Manager](https://nginxproxymanager.com/), [Tailscale Funnel](https://tailscale.com/kb/1223/funnel)
