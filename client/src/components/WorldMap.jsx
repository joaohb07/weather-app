import { useMemo } from 'react'
import { geoNaturalEarth1, geoPath, geoContains } from 'd3-geo'
import { feature } from 'topojson-client'
import * as iso3166 from 'iso-3166-1'
import worldData from 'world-atlas/countries-50m.json'

// Fixed internal SVG coordinate system used for responsive scaling via `viewBox`
const WIDTH = 1000
const HEIGHT = 520

/**
 * Maps a Celsius temperature value to a semantic color palette (fill + stroke)
 * so the highlighted country visually reflects cold, mild, warm, or hot climates.
 *
 * @param {number|null|undefined} temp - Current temperature in Celsius.
 * @returns {{ fill: string, stroke: string }} Hex color values for SVG path styling.
 */
function getThermalColor(temp) {
  if (temp === undefined || temp === null) return { fill: '#38bdf8', stroke: '#7dd3fc' }
  if (temp <= 10) return { fill: '#0284c7', stroke: '#38bdf8' } // Cold (Deep Blue)
  if (temp <= 22) return { fill: '#0d9488', stroke: '#2dd4bf' } // Mild (Teal)
  if (temp <= 30) return { fill: '#d97706', stroke: '#fbbf24' } // Warm (Amber)
  return { fill: '#e11d48', stroke: '#fb7185' } // Hot (Crimson Rose)
}

/**
 * Interactive vector world map that highlights the searched country and smoothly zooms
 * into the target coordinates with a pulsing SVG marker pin.
 *
 * @param {Object} props
 * @param {Object|null} props.location - Geographic payload returned by `/weather`.
 * @param {number|undefined} props.temperature - Current temperature used for thermal color coding.
 */
export default function WorldMap({ location, temperature }) {
  /**
   * Converts the static TopoJSON world atlas into an array of GeoJSON country polygons.
   *
   * Why `useMemo` with empty dependencies `[]`?
   * Parsing TopoJSON into hundreds of country geometries is computationally expensive.
   * Memoizing with `[]` ensures this conversion runs strictly once on initial mount
   * instead of repeating on every render or temperature update.
   */
  const countries = useMemo(() => {
    return feature(worldData, worldData.objects.countries).features
  }, [])

  /**
   * Initializes the D3 Natural Earth geographic projection centered within the SVG viewport.
   *
   * Why `useMemo`?
   * Keeps a single stable projection instance across renders so downstream `pathGenerator`
   * and coordinate calculations do not needlessly recompute.
   */
  const projection = useMemo(() => {
    return geoNaturalEarth1()
      .scale(185)
      .translate([WIDTH / 2, HEIGHT / 2 + 20])
  }, [])

  /**
   * Creates the D3 SVG path generator bound to our memoized projection.
   * Converts GeoJSON polygon coordinates into SVG `<path d="...">` strings.
   */
  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection])

  /**
   * Identifies which country polygon in `countries` corresponds to the searched `location`.
   *
   * Strategy:
   * 1. Primary lookup: Converts the ISO 3166-1 Alpha-3 country code (e.g., "PRT", "BRA")
   *    into its zero-padded ISO numeric ID to match `world-atlas` feature IDs (fast O(n) ID check).
   * 2. Fallback lookup: Uses spherical point-in-polygon detection (`geoContains`) with
   *    `[longitude, latitude]` in case the country code is missing or non-standard.
   *
   * Why `useMemo`?
   * Avoids running polygon containment geometry math unless `location` or `countries` changes.
   */
  const highlightedFeature = useMemo(() => {
    if (!location) return null

    if (location.countryCode) {
      const lookup = iso3166.whereAlpha3 || iso3166.default?.whereAlpha3
      const info = lookup ? lookup(location.countryCode.toUpperCase()) : null
      if (info?.numeric) {
        const padded = String(info.numeric).padStart(3, '0')
        const byId = countries.find(
          (geo) => geo.id != null && String(geo.id).padStart(3, '0') === padded
        )
        if (byId) return byId
      }
    }

    if (location.longitude != null && location.latitude != null) {
      const byCoords = countries.find((geo) =>
        geoContains(geo, [location.longitude, location.latitude])
      )
      if (byCoords) return byCoords
    }

    return null
  }, [location, countries])

  /**
   * Projects `[longitude, latitude]` into 2D SVG pixel coordinates `[x, y]` and computes
   * the CSS `transform` string to zoom and pan the map smoothly toward the target pin.
   *
   * Note: `WIDTH * 0.62` intentionally positions the target slightly to the right of center
   * so it isn't covered by the floating `WeatherCard` on the left side of desktop screens.
   */
  const { pinCoords, transformStyle } = useMemo(() => {
    if (!location?.longitude || !location?.latitude) {
      return {
        pinCoords: null,
        transformStyle: 'translate(0px, 0px) scale(1)'
      }
    }

    const projected = projection([location.longitude, location.latitude])
    if (!projected) {
      return { pinCoords: null, transformStyle: 'translate(0px, 0px) scale(1)' }
    }

    const [x, y] = projected
    const scale = 2.4
    const offsetX = WIDTH * 0.62 - x * scale
    const offsetY = HEIGHT * 0.5 - y * scale

    return {
      pinCoords: { x, y },
      transformStyle: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
    }
  }, [location, projection])

  // Determine fill/stroke colors based on current weather temperature
  const activeColors = getThermalColor(temperature)

  return (
    <div className="fixed inset-0 z-0 select-none bg-[radial-gradient(ellipse_at_center,_#0f172a_0%,_#060911_100%)]">
      {/* Subtle decorative dot-matrix grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {/* SVG Gaussian blur filter applied only to the highlighted country for a neon glow effect */}
        <defs>
          <filter id="country-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Camera group: hardware-accelerated CSS transform smoothly animates pan & zoom */}
        <g
          style={{
            transform: transformStyle,
            transformOrigin: '0 0',
            transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          {/* Render all world country polygons */}
          {countries.map((geo, index) => {
            const isHighlighted = highlightedFeature === geo
            return (
              <path
                key={geo.id || geo.properties?.name || index}
                d={pathGenerator(geo)}
                data-highlighted={isHighlighted ? 'true' : 'false'}
                fill={isHighlighted ? activeColors.fill : '#162033'}
                stroke={isHighlighted ? activeColors.stroke : '#26354d'}
                strokeWidth={isHighlighted ? 0.9 : 0.45}
                filter={isHighlighted ? 'url(#country-glow)' : undefined}
                className="transition-colors duration-700 ease-out"
              />
            )
          })}

          {/* Animated radar pulse + solid center dot marking the exact searched coordinates */}
          {pinCoords && (
            <g data-testid="map-pin" transform={`translate(${pinCoords.x}, ${pinCoords.y})`}>
              <circle r="6" fill={activeColors.stroke} opacity="0.35">
                <animate attributeName="r" from="2" to="10" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.7" to="0" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle r="2.2" fill="#ffffff" stroke={activeColors.fill} strokeWidth="1" />
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}