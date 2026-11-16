const app = require('./app')

// Read port from environment (Docker / cloud standard) or default to 3000 locally
const port = process.env.PORT || 3000

// Bind HTTP server to the configured TCP port and log readiness for container health checks
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})