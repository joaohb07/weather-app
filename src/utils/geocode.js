/**
 * @typedef {Object} GeocodeResult
 * @property {string} placeName - Formatted full address returned by OpenCage.
 * @property {number} latitude - Geographic latitude.
 * @property {number} longitude - Geographic longitude.
 * @property {string|null} countryCode - ISO 3166-1 alpha-3 country code (e.g., "PRT") used for map highlighting.
 * @property {string|null} countryName - Human-readable country name.
 */

/**
 * Converts an address or city name into geographic coordinates via the OpenCage Geocoding API.
 *
 * @param {string} address - Location query provided by the user.
 * @returns {Promise<GeocodeResult>} Normalized geographic metadata.
 * @throws {Error} When the API key is missing, the upstream request fails/times out, or no match is found.
 */
const geocode = async (address) => {
    // Fail fast if server environment configuration is incomplete
    const apiKey = process.env.OPENCAGE_API_KEY
    if (!apiKey) {
        throw new Error('OPENCAGE_API_KEY is not configured on the server.')
    }

    // Force English place names (`language=en`) for consistent UI rendering and request up to
    // 5 candidates (`limit=5`) so we can prioritize exact city matches over broader regions
    const url = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${encodeURIComponent(address)}&language=en&limit=5`

    // Enforce a 5-second timeout via `AbortSignal` to prevent hanging sockets if OpenCage stalls
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const data = await response.json()

    // Handle HTTP-level errors (e.g., 401 Invalid Key, 402 Quota Exceeded, 429 Rate Limit)
    if (!response.ok) {
        throw new Error(data?.status?.message || 'Unable to connect to OpenCage API!')
    }

    // Handle valid HTTP 200 responses that returned zero matching locations
    if (!data.results || data.results.length === 0) {
        throw new Error('Unable to find location. Try another search!')
    }

    // Prefer an exact city-level feature (`_type === 'city'`) when available, falling back to the top-ranked candidate
    const result = data.results.find((item) => item.components?._type === 'city') || data.results[0]

    // Normalize upstream schema into a clean internal contract decoupled from OpenCage's raw structure
    return {
        placeName: result.formatted,
        latitude: result.geometry.lat,
        longitude: result.geometry.lng,
        countryCode: result.components?.['ISO_3166-1_alpha-3'] || null,
        countryName: result.components?.country || null
    }
}

module.exports = geocode