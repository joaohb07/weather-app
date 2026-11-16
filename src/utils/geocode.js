/**
 * @typedef {Object} GeocodeResult
 * @property {string} placeName Formatted full address.
 * @property {number} latitude Geographic latitude.
 * @property {number} longitude Geographic longitude.
 * @property {string|null} countryCode ISO 3166-1 alpha-3 country code (e.g., "PRT").
 * @property {string|null} countryName Country name returned by the API.
 */

/**
 * Converts an address or city name into geographic coordinates via OpenCage API.
 *
 * @param {string} address Location query provided by the user.
 * @returns {Promise<GeocodeResult>} Normalized geographic data.
 * @throws {Error} When the API key is missing, the request fails, or no location is found.
 */
const geocode = async (address) => {
    const apiKey = process.env.OPENCAGE_API_KEY
    if (!apiKey) {
        throw new Error('OPENCAGE_API_KEY is not configured on the server.')
    }

    // Force English localization and fetch multiple candidates to prioritize city-level matches
    const url = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${encodeURIComponent(address)}&language=en&limit=5`

    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.status?.message || 'Unable to connect to OpenCage API!')
    }

    if (!data.results || data.results.length === 0) {
        throw new Error('Unable to find location. Try another search!')
    }

    // Prioritize exact city-level result over broader administrative regions
    const result = data.results.find((item) => item.components?._type === 'city') || data.results[0]

    return {
        placeName: result.formatted,
        latitude: result.geometry.lat,
        longitude: result.geometry.lng,
        countryCode: result.components?.['ISO_3166-1_alpha-3'] || null,
        countryName: result.components?.country || null
    }
}

module.exports = geocode