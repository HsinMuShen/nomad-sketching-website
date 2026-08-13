import type { SketchMapItem } from 'types/location'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import * as THREE from 'three'
import { useI18n } from 'libs/i18n'
import MapMarkerPopup from './MapMarkerPopup'

type MapViewProps = {
  items: SketchMapItem[]
  isFullscreen?: boolean
  onFullscreenChange?: (isFullscreen: boolean) => void
}

type MarkerPosition = {
  id: string
  x: number
  y: number
  visible: boolean
}

type ViewMode = 'earth' | 'taiwan'

const TaiwanLeafletMap = dynamic(() => import('./TaiwanLeafletMap'), {
  ssr: false,
})

const EARTH_RADIUS = 1.45
const INITIAL_CAMERA_Z = 4.2
const MIN_CAMERA_Z = 2.55
const MAX_CAMERA_Z = 6.2
const INITIAL_ROTATION = {
  x: THREE.MathUtils.degToRad(-12),
  y: THREE.MathUtils.degToRad(-210),
}

const getInitialItem = (items: SketchMapItem[]) => items[0] || null
const getMarkerLabel = (item: SketchMapItem) => item.city || item.placeName || item.country || item.title
const getMarkerSubLabel = (item: SketchMapItem) => [item.placeName, item.country].filter(Boolean).join(' · ')
const isTaiwanItem = (item: SketchMapItem) =>
  item.country?.toLowerCase() === 'taiwan' ||
  (item.latitude >= 21.6 && item.latitude <= 25.6 && item.longitude >= 119.4 && item.longitude <= 122.4)

const latLngToVector = (latitude: number, longitude: number, radius = EARTH_RADIUS) => {
  const latitudeRadians = THREE.MathUtils.degToRad(latitude)
  const longitudeRadians = THREE.MathUtils.degToRad(longitude)
  const cosLatitude = Math.cos(latitudeRadians)

  return new THREE.Vector3(
    radius * cosLatitude * Math.cos(longitudeRadians),
    radius * Math.sin(latitudeRadians),
    -radius * cosLatitude * Math.sin(longitudeRadians),
  )
}

const createStyledEarthTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const context = canvas.getContext('2d')

  if (!context) return null

  context.fillStyle = '#91d9d0'
  context.fillRect(0, 0, canvas.width, canvas.height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8

  const image = new Image()
  image.src = '/images/earth_atmos_2048.jpg'
  image.onload = () => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.filter = 'saturate(0.55) contrast(0.82) brightness(1.18)'
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    context.filter = 'none'

    context.globalCompositeOperation = 'screen'
    context.fillStyle = 'rgba(230, 250, 248, 0.28)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.globalCompositeOperation = 'source-over'

    context.strokeStyle = 'rgba(255,255,255,0.16)'
    context.lineWidth = 1
    for (let x = 0; x <= canvas.width; x += canvas.width / 12) {
      context.beginPath()
      context.moveTo(x, 0)
      context.lineTo(x, canvas.height)
      context.stroke()
    }
    for (let y = canvas.height / 6; y < canvas.height; y += canvas.height / 6) {
      context.beginPath()
      context.moveTo(0, y)
      context.lineTo(canvas.width, y)
      context.stroke()
    }

    texture.needsUpdate = true
  }

  return texture
}

const MapView = ({ items, isFullscreen = false, onFullscreenChange }: MapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const earthGroupRef = useRef<THREE.Group | null>(null)
  const markerRefs = useRef<Array<{ id: string; position: THREE.Vector3 }>>([])
  const frameRef = useRef<number | null>(null)
  const rotationRef = useRef(INITIAL_ROTATION)
  const cameraZRef = useRef(INITIAL_CAMERA_Z)
  const pointerStartRef = useRef<{
    x: number
    y: number
    rotationX: number
    rotationY: number
  } | null>(null)

  const [selectedId, setSelectedId] = useState(() => getInitialItem(items)?.id)
  const [markerPositions, setMarkerPositions] = useState<MarkerPosition[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('taiwan')
  const { t } = useI18n()
  const layoutKey = isFullscreen ? 'fullscreen' : 'embedded'
  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) || getInitialItem(items),
    [items, selectedId],
  )
  const taiwanItems = useMemo(() => items.filter(isTaiwanItem), [items])

  useEffect(() => {
    const resize = () => {
      window.dispatchEvent(new Event('resize'))
    }
    let nestedFrame = 0
    const firstFrame = window.requestAnimationFrame(resize)
    const secondFrame = window.requestAnimationFrame(() => {
      nestedFrame = window.requestAnimationFrame(resize)
    })
    const timeout = window.setTimeout(resize, 320)

    return () => {
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
      window.cancelAnimationFrame(nestedFrame)
      window.clearTimeout(timeout)
    }
  }, [isFullscreen])

  useEffect(() => {
    const syncFullscreenState = () => {
      onFullscreenChange?.(document.fullscreenElement === containerRef.current)
    }

    document.addEventListener('fullscreenchange', syncFullscreenState)

    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState)
    }
  }, [onFullscreenChange])

  const updateMarkerPositions = useCallback(() => {
    const mount = mountRef.current
    const camera = cameraRef.current
    const earthGroup = earthGroupRef.current
    if (!mount || !camera || !earthGroup) return

    const rect = mount.getBoundingClientRect()
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)
    const positions = markerRefs.current.map((marker) => {
      const worldPosition = marker.position.clone().applyMatrix4(earthGroup.matrixWorld)
      const outwardNormal = worldPosition.clone().normalize()
      const projected = worldPosition.clone().project(camera)
      const isInFront = outwardNormal.dot(cameraDirection) < -0.08

      return {
        id: marker.id,
        x: ((projected.x + 1) / 2) * rect.width,
        y: ((-projected.y + 1) / 2) * rect.height,
        visible: isInFront && projected.z < 1,
      }
    })

    setMarkerPositions(positions)
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#f7fbfb')

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0, INITIAL_CAMERA_Z)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const earthGroup = new THREE.Group()
    earthGroup.rotation.set(rotationRef.current.x, rotationRef.current.y, 0)
    scene.add(earthGroup)

    const earthTexture = createStyledEarthTexture()
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS, 96, 96),
      new THREE.MeshStandardMaterial({
        map: earthTexture || undefined,
        roughness: 0.86,
        metalness: 0.03,
      }),
    )
    earthGroup.add(earth)

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS * 1.035, 96, 96),
      new THREE.MeshBasicMaterial({
        color: '#baf4ee',
        transparent: true,
        opacity: 0.22,
        side: THREE.BackSide,
      }),
    )
    scene.add(atmosphere)

    const markerMaterial = new THREE.MeshBasicMaterial({ color: '#ff5f5f' })
    markerRefs.current = items.map((item) => {
      const position = latLngToVector(item.latitude, item.longitude, EARTH_RADIUS * 1.012)
      const marker = new THREE.Mesh(new THREE.SphereGeometry(0.026, 16, 16), markerMaterial)
      marker.position.copy(position)
      earthGroup.add(marker)
      return { id: item.id, position }
    })

    scene.add(new THREE.AmbientLight('#ffffff', 2.1))
    const keyLight = new THREE.DirectionalLight('#ffffff', 2.4)
    keyLight.position.set(-2, 2.6, 4)
    scene.add(keyLight)
    const rimLight = new THREE.DirectionalLight('#7ee8dc', 1.2)
    rimLight.position.set(4, -1, -2)
    scene.add(rimLight)

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    earthGroupRef.current = earthGroup

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
      updateMarkerPositions()
    }

    const animate = () => {
      frameRef.current = window.requestAnimationFrame(animate)
      earthGroup.rotation.x = rotationRef.current.x
      earthGroup.rotation.y = rotationRef.current.y
      camera.position.z = cameraZRef.current
      atmosphere.rotation.copy(earthGroup.rotation)
      renderer.render(scene, camera)
      updateMarkerPositions()
    }

    resize()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
      renderer.dispose()
      earth.geometry.dispose()
      earth.material.dispose()
      atmosphere.geometry.dispose()
      atmosphere.material.dispose()
      markerMaterial.dispose()
      earthTexture?.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      scene.clear()
    }
  }, [items, updateMarkerPositions, isFullscreen])

  const rotateToItem = (item: SketchMapItem) => {
    rotationRef.current = {
      x: THREE.MathUtils.degToRad(-item.latitude * 0.55),
      y: THREE.MathUtils.degToRad(-(item.longitude + 90)),
    }
    cameraZRef.current = Math.min(cameraZRef.current, 3.2)
  }

  const zoom = (delta: number) => {
    cameraZRef.current = Math.min(MAX_CAMERA_Z, Math.max(MIN_CAMERA_Z, cameraZRef.current + delta))
  }

  const resetEarth = () => {
    rotationRef.current = INITIAL_ROTATION
    cameraZRef.current = INITIAL_CAMERA_Z
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    zoom(event.deltaY > 0 ? 0.28 : -0.28)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button, a')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      rotationX: rotationRef.current.x,
      rotationY: rotationRef.current.y,
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current
    if (!start) return

    rotationRef.current = {
      x: Math.max(-1.15, Math.min(1.15, start.rotationX + (event.clientY - start.y) * 0.006)),
      y: start.rotationY + (event.clientX - start.x) * 0.007,
    }
  }

  const stopDragging = () => {
    pointerStartRef.current = null
  }

  const toggleFullscreen = async () => {
    const container = containerRef.current
    if (!container) return

    if (document.fullscreenElement) {
      await document.exitFullscreen()
      onFullscreenChange?.(false)
      return
    }

    if (container.requestFullscreen) {
      await container.requestFullscreen()
      onFullscreenChange?.(true)
      return
    }

    onFullscreenChange?.(true)
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-[#f7fbfb] transition-all duration-300 ${
        isFullscreen
          ? 'fixed left-0 top-0 z-[4000] h-screen w-screen rounded-none shadow-none'
          : 'h-[72vh] min-h-[520px] max-h-[760px] rounded-2 shadow-default'
      }`}
    >
      <div
        ref={mountRef}
        className={`absolute inset-0 cursor-grab touch-none transition-opacity duration-300 active:cursor-grabbing ${
          viewMode === 'earth' ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      />

      <div
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0,transparent_35%,rgba(247,251,251,0.6)_72%,#f7fbfb_100%)] ${
          viewMode === 'earth' ? 'z-[10]' : 'z-0'
        }`}
      />

      {viewMode === 'taiwan' && (
        <TaiwanLeafletMap
          items={taiwanItems}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          t={t}
          layoutKey={layoutKey}
        />
      )}

      <div className="absolute left-6 top-6 z-[900] max-w-76">
        <div className="mb-2 text-xs font-bold tracking-0.22em text-gray-500">
          {viewMode === 'earth' ? 'NOMAD EARTH' : 'TAIWAN SKETCH MAP'}
        </div>
        <div className="rounded-2 bg-white/78 px-4 py-3 text-sm leading-relaxed text-gray-600 shadow-default backdrop-blur-sm">
          {viewMode === 'earth' ? t('map.note') : t('map.taiwanNote')}
        </div>
      </div>

      <div className="absolute right-6 top-6 z-[900] flex overflow-hidden rounded-full bg-white/82 shadow-default backdrop-blur-sm">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-bold ${viewMode === 'taiwan' ? 'bg-secondary-50 text-secondary-800' : 'hover:bg-neutral-100'}`}
          onClick={() => setViewMode('taiwan')}
        >
          {t('map.taiwan')}
        </button>
        <button
          type="button"
          className={`border-l border-neutral-200 px-4 py-2 text-sm font-bold ${viewMode === 'earth' ? 'bg-secondary-50 text-secondary-800' : 'hover:bg-neutral-100'}`}
          onClick={() => setViewMode('earth')}
        >
          {t('map.earth')}
        </button>
      </div>

      {onFullscreenChange && (
        <button
          type="button"
          className="absolute right-6 z-[900] rounded-full bg-white/84 px-4 py-2 text-sm font-bold text-gray-700 shadow-default backdrop-blur-sm transition-colors hover:bg-white"
          style={{ top: viewMode === 'earth' ? 128 : 80 }}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? t('map.exitFullscreen') : t('map.fullscreen')}
        </button>
      )}

      {viewMode === 'earth' && (
        <div className="absolute right-6 top-20 z-[900] flex overflow-hidden rounded-full bg-white/82 shadow-default backdrop-blur-sm">
          <button type="button" className="px-4 py-2 text-lg font-bold hover:bg-neutral-100" onClick={() => zoom(0.35)}>
            -
          </button>
          <button
            type="button"
            className="border-x border-neutral-200 px-4 py-2 text-sm font-bold"
            onClick={resetEarth}
          >
            Earth
          </button>
          <button
            type="button"
            className="px-4 py-2 text-lg font-bold hover:bg-neutral-100"
            onClick={() => zoom(-0.35)}
          >
            +
          </button>
        </div>
      )}

      <div className="absolute bottom-6 left-6 z-[900] flex items-center gap-2 rounded-full bg-white/78 px-4 py-2 text-xs text-gray-500 shadow-default backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-primary-500" />
        <span>{viewMode === 'earth' ? items.length : taiwanItems.length} sketches</span>
      </div>

      {viewMode === 'earth' &&
        items.map((item) => {
          const position = markerPositions.find((marker) => marker.id === item.id)
          const isSelected = selectedItem?.id === item.id
          if (!position?.visible) return null

          return (
            <button
              key={`${item.type}-${item.id}`}
              type="button"
              style={{ left: position.x, top: position.y }}
              className={`absolute z-[800] flex w-40 -translate-x-1/2 -translate-y-full items-end gap-2 rounded-2 border bg-white/92 px-2.5 py-2 text-left shadow-hover backdrop-blur-sm transition-all hover:-translate-y-[calc(100%+4px)] hover:shadow-dialog ${
                isSelected ? 'border-primary-400 ring-2 ring-primary-50' : 'border-white/80 hover:border-secondary-400'
              }`}
              onClick={() => {
                setSelectedId(item.id)
                rotateToItem(item)
              }}
            >
              <span
                className={`relative mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-white shadow-default ${
                  isSelected ? 'bg-primary-500' : 'bg-secondary-500'
                }`}
              >
                <span className="absolute left-1/2 top-[18px] h-3 w-0.5 -translate-x-1/2 bg-gray-500/40" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-gray-800">{getMarkerLabel(item)}</span>
                {getMarkerSubLabel(item) && (
                  <span className="block truncate text-xs leading-snug text-gray-500">{getMarkerSubLabel(item)}</span>
                )}
              </span>
            </button>
          )
        })}

      <aside className="absolute bottom-6 right-6 z-[900] w-[min(360px,calc(100vw-3rem))]">
        {selectedItem ? (
          <MapMarkerPopup item={selectedItem} />
        ) : (
          <div className="rounded-2 border border-dashed border-neutral-300 bg-white/85 p-6 text-sm text-gray-500 shadow-default backdrop-blur-sm">
            {t('map.selectSketch')}
          </div>
        )}
      </aside>
    </div>
  )
}

export default MapView
