import type { SketchMapItem } from 'types/location'
import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'

type TaiwanLeafletMapProps = {
  items: SketchMapItem[]
  selectedId?: string
  setSelectedId: (id: string) => void
  t: (key: string) => string
  layoutKey: string
}

type FlyToSelectedProps = {
  item?: SketchMapItem | null
  onMoveStateChange: (isMoving: boolean) => void
}

type TileStyle = 'light' | 'classic' | 'voyager'

const TAIWAN_CENTER: [number, number] = [23.75, 121]

const TILE_STYLES: Record<TileStyle, { labelKey: string; attribution: string; url: string }> = {
  light: {
    labelKey: 'map.styleLight',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  },
  classic: {
    labelKey: 'map.styleClassic',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  voyager: {
    labelKey: 'map.styleVoyager',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  },
}

const getMarkerLabel = (item: SketchMapItem) => item.city || item.placeName || item.country || item.title
const getPlaceLine = (item: SketchMapItem) => [item.placeName, item.city, item.country].filter(Boolean).join(' · ')

const FlyToSelected = ({ item, onMoveStateChange }: FlyToSelectedProps) => {
  const map = useMap()

  useEffect(() => {
    if (!item) return

    onMoveStateChange(true)
    map.flyTo([item.latitude, item.longitude], Math.max(map.getZoom(), 13), {
      animate: true,
      duration: 0.7,
    })

    const handleMoveEnd = () => {
      onMoveStateChange(false)
    }
    const fallback = window.setTimeout(handleMoveEnd, 900)

    map.once('moveend', handleMoveEnd)

    return () => {
      window.clearTimeout(fallback)
      map.off('moveend', handleMoveEnd)
    }
  }, [item, map, onMoveStateChange])

  return null
}

const ResizeMap = ({ layoutKey }: { layoutKey: string }) => {
  const map = useMap()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      map.invalidateSize(false)
    })
    const timeout = window.setTimeout(() => {
      map.invalidateSize(false)
    }, 280)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [layoutKey, map])

  return null
}

const TaiwanLeafletMap = ({ items, selectedId, setSelectedId, t, layoutKey }: TaiwanLeafletMapProps) => {
  const [tileStyle, setTileStyle] = useState<TileStyle>('light')
  const [isMapMoving, setIsMapMoving] = useState(false)
  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) || null, [items, selectedId])
  const currentTileStyle = TILE_STYLES[tileStyle]

  return (
    <div className="absolute inset-0 bg-[#f7fbfb]">
      <MapContainer
        key={layoutKey}
        center={TAIWAN_CENTER}
        zoom={8}
        minZoom={7}
        maxZoom={19}
        scrollWheelZoom
        className="h-full w-full"
        zoomControl
      >
        <TileLayer key={tileStyle} attribution={currentTileStyle.attribution} url={currentTileStyle.url} />
        <ResizeMap layoutKey={layoutKey} />
        <FlyToSelected item={selectedItem} onMoveStateChange={setIsMapMoving} />
        {items.map((item) => {
          const isSelected = selectedId === item.id
          return (
            <CircleMarker
              key={`${item.type}-${item.id}`}
              center={[item.latitude, item.longitude]}
              radius={isSelected ? 11 : 8}
              opacity={isMapMoving ? 0 : 1}
              fillOpacity={isMapMoving ? 0 : 0.95}
              pathOptions={{
                color: '#ffffff',
                weight: 3,
                fillColor: isSelected ? '#ff5f5f' : '#02cab9',
              }}
              eventHandlers={{
                click: () => setSelectedId(item.id),
              }}
            >
              <Popup>
                <div className="min-w-44">
                  <div className="text-xs uppercase tracking-0.18em text-gray-500">{item.type}</div>
                  <div className="mt-1 font-bold text-gray-800">{getMarkerLabel(item)}</div>
                  {getPlaceLine(item) && <div className="mt-1 text-xs text-gray-500">{getPlaceLine(item)}</div>}
                  {item.locationNote && (
                    <div className="mt-2 text-xs leading-relaxed text-gray-600">{item.locationNote}</div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>

      <div className="absolute left-6 top-22 z-[650] max-w-74 rounded-2 bg-white/86 px-4 py-3 text-sm leading-relaxed text-gray-600 shadow-default backdrop-blur-sm">
        {items.length > 0 ? t('map.taiwanNote') : t('map.noTaiwanItems')}
      </div>
      <div className="absolute left-6 bottom-18 z-[650] rounded-2 bg-white/86 p-2 shadow-default backdrop-blur-sm">
        <div className="px-2 pb-1 text-xs font-bold tracking-0.16em text-gray-500">{t('map.style')}</div>
        <div className="flex gap-1">
          {(Object.keys(TILE_STYLES) as TileStyle[]).map((style) => (
            <button
              key={style}
              type="button"
              className={`rounded-1 px-3 py-1.5 text-xs font-bold ${
                tileStyle === style ? 'bg-secondary-50 text-secondary-800' : 'text-gray-600 hover:bg-neutral-100'
              }`}
              onClick={() => setTileStyle(style)}
            >
              {t(TILE_STYLES[style].labelKey)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaiwanLeafletMap
