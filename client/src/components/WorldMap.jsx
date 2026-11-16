import { useMemo } from 'react'
import { geoNaturalEarth1, geoPath, geoContains } from 'd3-geo'
import { feature } from 'topojson-client'
import * as iso3166 from 'iso-3166-1'
import worldData from 'world-atlas/countries-50m.json'

const WIDTH = 1000
const HEIGHT = 520

function getThermalColor(temp) {
  if (temp === undefined || temp === null) return { fill: '#38bdf8', stroke: '#7dd3fc' }
  if (temp <= 10) return { fill: '#0284c7', stroke: '#38bdf8' }   // Frio (Azul)
  if (temp <= 22) return { fill: '#0d9488', stroke: '#2dd4bf' }   // Ameno (Teal/Esmeralda)
  if (temp <= 30) return { fill: '#d97706', stroke: '#fbbf24' }   // Quente (Âmbar)
  return { fill: '#e11d48', stroke: '#fb7185' }                   // Muito quente (Coral)
}

export default function WorldMap({ location, temperature }) {
  const countries = useMemo(() => {
    return feature(worldData, worldData.objects.countries).features
  }, [])

  const projection = useMemo(() => {
    return geoNaturalEarth1()
      .scale(185)
      .translate([WIDTH / 2, HEIGHT / 2 + 20])
  }, [])

  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection])

  // Identifica o polígono do país por código ISO ou pelas próprias coordenadas [lng, lat]
  const highlightedFeature = useMemo(() => {
    if (!location) return null

    // 1. Busca pelo código ISO Alpha-3 -> ID numérico (ex: "ESP" -> "724")
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

    // 2. Fallback geométrico: encontra o país que contém o ponto [longitude, latitude]
    if (location.longitude != null && location.latitude != null) {
      const byCoords = countries.find((geo) =>
        geoContains(geo, [location.longitude, location.latitude])
      )
      if (byCoords) return byCoords
    }

    return null
  }, [location, countries])

  // Calcula posição do pin e transformação de zoom suave
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
    // Desloca o foco levemente para a direita no desktop para não ficar atrás do card à esquerda
    const offsetX = WIDTH * 0.62 - x * scale
    const offsetY = HEIGHT * 0.5 - y * scale

    return {
      pinCoords: { x, y },
      transformStyle: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
    }
  }, [location, projection])

  const activeColors = getThermalColor(temperature)

  return (
    <div className="fixed inset-0 z-0 select-none bg-[radial-gradient(ellipse_at_center,_#0f172a_0%,_#060911_100%)]">
      {/* Grade sutil de fundo */}
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
        <defs>
          <filter id="country-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g
          style={{
            transform: transformStyle,
            transformOrigin: '0 0',
            transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          {countries.map((geo, index) => {
            const isHighlighted = highlightedFeature === geo
            return (
              <path
                key={geo.id || geo.properties?.name || index}
                d={pathGenerator(geo)}
                fill={isHighlighted ? activeColors.fill : '#162033'}
                stroke={isHighlighted ? activeColors.stroke : '#26354d'}
                strokeWidth={isHighlighted ? 0.9 : 0.45}
                filter={isHighlighted ? 'url(#country-glow)' : undefined}
                className="transition-colors duration-700 ease-out"
              />
            )
          })}

          {/* Pin pulsante na coordenada exata */}
          {pinCoords && (
            <g transform={`translate(${pinCoords.x}, ${pinCoords.y})`}>
              <circle r="6" fill={activeColors.stroke} opacity="0.35">
                <animate
                  attributeName="r"
                  from="2"
                  to="10"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.7"
                  to="0"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="2.2" fill="#ffffff" stroke={activeColors.fill} strokeWidth="1" />
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}