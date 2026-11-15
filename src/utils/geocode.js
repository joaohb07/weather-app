const geocode = async (address) => {
    const apiKey = process.env.OPENCAGE_API_KEY
    if (!apiKey) {
        throw new Error('OPENCAGE_API_KEY is not configured on the server.')
    }

    const url = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${encodeURIComponent(address)}&limit=1`

    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.status?.message || 'Unable to connect to OpenCage API!')
    }

    if (!data.results || data.results.length === 0) {
        throw new Error('Unable to find location. Try another search!')
    }

    return {
        placeName: data.results[0].formatted,
        latitude: data.results[0].geometry.lat,
        longitude: data.results[0].geometry.lng
    }
}

module.exports = geocode