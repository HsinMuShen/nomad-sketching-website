import { useEffect, useRef, useState } from 'react'
import type { PointerEvent, WheelEvent } from 'react'
import * as THREE from 'three'
import type { PerspectiveAnnotation } from 'types/spatialMemory'

type SpatialMemoryViewerProps = {
  t: (key: string) => string
  annotation: PerspectiveAnnotation
}

type DragState = {
  x: number
  y: number
  rotationX: number
  rotationY: number
}

const SpatialMemoryViewer = ({ t, annotation }: SpatialMemoryViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const rotationRef = useRef({ x: -0.18, y: -0.52 })
  const cameraZRef = useRef(6.5)
  const dragRef = useRef<DragState | null>(null)
  const [isWebglAvailable, setIsWebglAvailable] = useState(true)
  const hasFacade = annotation.facadePoints.length === 4

  useEffect(() => {
    rotationRef.current = { x: -0.18, y: -0.52 }
    cameraZRef.current = 6.5
  }, [annotation])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || !hasFacade) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer: THREE.WebGLRenderer

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setIsWebglAvailable(false)
      return undefined
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor('#f7f7f5', 1)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const vanishingPointA = annotation.vanishingPoints.find((point) => point.axis === 'a')
    const vanishingPointB = annotation.vanishingPoints.find((point) => point.axis === 'b')
    const vanishingPointSeparation =
      vanishingPointA && vanishingPointB ? Math.abs(vanishingPointA.x - vanishingPointB.x) : 0.5
    const fieldOfView = Math.max(28, Math.min(52, 54 - vanishingPointSeparation * 28))
    const camera = new THREE.PerspectiveCamera(fieldOfView, 1, 0.1, 100)
    const firstVanishingPoint = annotation.vanishingPoints.find((point) => point.axis === 'a')
    const cameraX = firstVanishingPoint ? (firstVanishingPoint.x - 0.5) * 3 : 0
    const cameraY = 2.8 + (0.5 - (annotation.horizonY ?? 0.5)) * 3
    camera.position.set(cameraX + 3.8, cameraY, cameraZRef.current)
    camera.lookAt(0, 1, 0)

    scene.add(new THREE.HemisphereLight('#ffffff', '#b4b4b4', 2.6))
    const keyLight = new THREE.DirectionalLight('#ffffff', 3.1)
    keyLight.position.set(-4, 7, 5)
    scene.add(keyLight)

    const interpretation = new THREE.Group()
    scene.add(interpretation)

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(7.6, 5.6),
      new THREE.MeshStandardMaterial({ color: '#eeeeeb', roughness: 1 }),
    )
    ground.rotation.x = -Math.PI / 2
    interpretation.add(ground)

    const grid = new THREE.GridHelper(7.4, 16, '#b8b8b3', '#deded9')
    grid.position.y = 0.012
    interpretation.add(grid)

    const minX = Math.min(...annotation.facadePoints.map((point) => point.x))
    const maxX = Math.max(...annotation.facadePoints.map((point) => point.x))
    const maxY = Math.max(...annotation.facadePoints.map((point) => point.y))
    const centerX = (minX + maxX) / 2
    const facadePoints = annotation.facadePoints.map(
      (point) => new THREE.Vector2((point.x - centerX) * 5, (maxY - point.y) * 4),
    )
    const shape = new THREE.Shape()
    shape.moveTo(facadePoints[0].x, facadePoints[0].y)
    facadePoints.slice(1).forEach((point) => shape.lineTo(point.x, point.y))
    shape.closePath()

    const facadeWidth = Math.max(0.2, (maxX - minX) * 5)
    const perspectiveDepthFactor = Math.max(0.22, Math.min(0.65, 0.72 - vanishingPointSeparation * 0.55))
    const depth = facadeWidth * perspectiveDepthFactor
    const facade = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false }),
      new THREE.MeshStandardMaterial({ color: '#343434', roughness: 0.92, metalness: 0 }),
    )
    facade.position.z = -0.45
    interpretation.add(facade)

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(facade.geometry),
      new THREE.LineBasicMaterial({ color: '#111111', transparent: true, opacity: 0.8 }),
    )
    edges.position.copy(facade.position)
    interpretation.add(edges)

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      renderer.setSize(width, Math.max(height, 1), false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }

    let frame = 0
    const animate = () => {
      frame = window.requestAnimationFrame(animate)
      if (!reducedMotion && !dragRef.current) rotationRef.current.y += 0.0012
      interpretation.rotation.x = rotationRef.current.x
      interpretation.rotation.y = rotationRef.current.y
      camera.position.z = cameraZRef.current
      camera.lookAt(0, 0.8, 0)
      renderer.render(scene, camera)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh) && !(object instanceof THREE.LineSegments)) return
        object.geometry.dispose()
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
        else object.material.dispose()
      })
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [annotation, hasFacade])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      rotationX: rotationRef.current.x,
      rotationY: rotationRef.current.y,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return
    rotationRef.current = {
      x: Math.max(-0.9, Math.min(0.5, drag.rotationX + (event.clientY - drag.y) * 0.006)),
      y: drag.rotationY + (event.clientX - drag.x) * 0.008,
    }
  }

  const handlePointerUp = () => {
    dragRef.current = null
  }

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    cameraZRef.current = Math.max(4.8, Math.min(9, cameraZRef.current + (event.deltaY > 0 ? 0.28 : -0.28)))
  }

  const resetView = () => {
    rotationRef.current = { x: -0.18, y: -0.52 }
    cameraZRef.current = 6.5
  }

  if (!hasFacade) {
    return (
      <div className="flex h-full min-h-80 items-center justify-center bg-[#f7f7f5] p-8 text-center">
        <div className="max-w-xs">
          <p className="mb-2 text-sm font-bold uppercase tracking-0.15em text-gray-500">
            {t('spatialMemory.geometryWaitingTitle')}
          </p>
          <p className="text-sm leading-relaxed text-gray-600">{t('spatialMemory.geometryWaitingDescription')}</p>
        </div>
      </div>
    )
  }

  if (!isWebglAvailable) {
    return (
      <div className="flex h-full min-h-80 items-center justify-center bg-[#f7f7f5] p-8 text-center">
        <div className="max-w-xs">
          <p className="mb-2 text-sm font-bold uppercase tracking-0.15em text-gray-500">
            {t('spatialMemory.fallbackTitle')}
          </p>
          <p className="text-sm leading-relaxed text-gray-600">{t('spatialMemory.fallbackDescription')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-80 overflow-hidden bg-[#f7f7f5]">
      <div
        ref={mountRef}
        className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        aria-label={t('spatialMemory.viewerLabel')}
        role="img"
      />
      <div className="pointer-events-none absolute left-4 top-4 max-w-56 rounded-1 bg-white/88 px-3 py-2 text-xs leading-relaxed text-gray-600 shadow-default backdrop-blur-sm">
        <p>{t('spatialMemory.viewerHint')}</p>
        <p className="mt-1 font-bold text-gray-800">
          {annotation.facadePoints.length} {t('spatialMemory.profileFacade')} · {annotation.vanishingPoints.length}{' '}
          {t('spatialMemory.profileVanishingPoints')}
        </p>
      </div>
      <button
        type="button"
        onClick={resetView}
        className="absolute bottom-4 right-4 min-h-11 rounded-1 bg-white/90 px-3 py-2 text-xs font-bold text-gray-700 shadow-default hover:bg-white"
        aria-label={t('spatialMemory.resetView')}
      >
        {t('spatialMemory.resetView')}
      </button>
    </div>
  )
}

export default SpatialMemoryViewer
