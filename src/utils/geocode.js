/**
 * @typedef {Object} GeocodeResult
 * @property {string} placeName - Endereço completo formatado.
 * @property {number} latitude - Latitude geográfica.
 * @property {number} longitude - Longitude geográfica.
 * @property {string|null} countryCode - Código do país (ex: "PRT").
 * @property {string|null} countryName - Nome do país retornado pela API.
 */

/**
 * Converte um endereço ou nome de cidade em coordenadas geográficas via OpenCage API.
 *
 * @param {string} address - Localização pesquisada pelo usuário.
 * @returns {Promise<GeocodeResult>} Dados geográficos normalizados.
 * @throws {Error} Quando a chave de API está ausente, a API falha ou nenhum local é encontrado.
 */
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

    const result = data.results[0]

    return {
        placeName: result.formatted,
        latitude: result.geometry.lat,
        longitude: result.geometry.lng,
        countryCode: result.components?.['ISO_3166-1_alpha-3'] || null,
        countryName: result.components?.country || null
    }
}

module.exports = geocode