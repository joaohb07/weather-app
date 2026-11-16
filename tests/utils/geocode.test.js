const geocode = require('../../src/utils/geocode')

describe('geocode utility', () => {
    const originalEnv = process.env

    beforeEach(() => {
        process.env = { ...originalEnv, OPENCAGE_API_KEY: 'test-opencage-key' }
    })

    afterEach(() => {
        process.env = originalEnv
        jest.restoreAllMocks()
    })

    it('should throw an error when OPENCAGE_API_KEY is missing', async () => {
        delete process.env.OPENCAGE_API_KEY

        await expect(geocode('Porto')).rejects.toThrow(
            'OPENCAGE_API_KEY is not configured on the server.'
        )
    })

    it('should return formatted location data and ISO country code for a valid address', async () => {
        const mockResponse = {
            results: [
                {
                    formatted: 'Porto, Portugal',
                    geometry: { lat: 41.14961, lng: -8.61099 },
                    components: {
                        ['ISO_3166-1_alpha-3']: 'PRT',
                        country: 'Portugal'
                    }
                }
            ]
        }

        const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => mockResponse
        })

        const result = await geocode('Porto, Portugal')

        expect(fetchSpy).toHaveBeenCalledWith(
            'https://api.opencagedata.com/geocode/v1/json?key=test-opencage-key&q=Porto%2C%20Portugal&limit=1',
            { signal: expect.any(AbortSignal) }
        )
        expect(result).toEqual({
            placeName: 'Porto, Portugal',
            latitude: 41.14961,
            longitude: -8.61099,
            countryCode: 'PRT',
            countryName: 'Portugal'
        })
    })

    it('should fallback countryCode and countryName to null when components are absent', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({
                results: [
                    {
                        formatted: 'International Waters',
                        geometry: { lat: 0, lng: 0 }
                    }
                ]
            })
        })

        const result = await geocode('0, 0')

        expect(result.countryCode).toBeNull()
        expect(result.countryName).toBeNull()
    })

    it('should throw a not found error when results array is empty', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({ results: [] })
        })

        await expect(geocode('CidadeInexistente123')).rejects.toThrow(
            'Unable to find location. Try another search!'
        )
    })

    it('should throw API status message when OpenCage responds with non-OK status', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: false,
            json: async () => ({
                status: { message: 'invalid API key' }
            })
        })

        await expect(geocode('Lisbon')).rejects.toThrow('invalid API key')
    })

    it('should propagate network or timeout errors from fetch', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network timeout'))

        await expect(geocode('Tokyo')).rejects.toThrow('Network timeout')
    })
})