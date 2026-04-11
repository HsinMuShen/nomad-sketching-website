import { useEffect, useMemo, useRef, useState } from 'react'
import type { Artwork } from 'types/artworks'
import ImageDisplay from 'components/CarouselArtworks/components/ImageDisplay'

type CardPosition = {
  x: number
  y: number
  rotation: number
  z: number
}

const CARD_WIDTH = 220
const CARD_HEIGHT = 240
const CARD_PADDING = 16

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const seededNumber = (seed: string, min: number, max: number) => {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  const ratio = (Math.abs(hash) % 1000) / 1000
  return min + (max - min) * ratio
}

const PostcardPlayground = ({ artworks }: { artworks: Artwork[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef<{
    id: string
    pointerOffsetX: number
    pointerOffsetY: number
    moved: boolean
  } | null>(null)

  const [positions, setPositions] = useState<Record<string, CardPosition>>({})
  const [isImageCover, setIsImageCover] = useState(false)
  const [selectedArtworkId, setSelectedArtworkId] = useState('')
  const [imageTitle, setImageTitle] = useState('')
  const [isDraggingPanel, setIsDraggingPanel] = useState(false)
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [panelOpen, setPanelOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  const postcards = useMemo(
    () =>
      artworks
        .filter((artwork) => artwork.mainImage?.src)
        .map((artwork) => ({ ...artwork, src: artwork.mainImage!.src })),
    [artworks],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container || postcards.length === 0) return

    const { width, height } = container.getBoundingClientRect()
    const maxX = Math.max(CARD_PADDING, width - CARD_WIDTH - CARD_PADDING)
    const maxY = Math.max(CARD_PADDING, height - CARD_HEIGHT - CARD_PADDING)

    const generatedPositions: Record<string, CardPosition> = {}
    postcards.forEach((postcard, index) => {
      generatedPositions[postcard.id] = {
        x: seededNumber(`${postcard.id}-x`, CARD_PADDING, maxX),
        y: seededNumber(`${postcard.id}-y`, CARD_PADDING, maxY),
        rotation: seededNumber(`${postcard.id}-r`, -9, 9),
        z: index + 1,
      }
    })
    setPositions(generatedPositions)
  }, [postcards])

  const pickImage = (imgUrl: string, name: string, id: string) => {
    setPreviewUrl(imgUrl)
    setBackgroundPosition({ x: 0, y: 0 })
    setImageTitle(name)
    setSelectedArtworkId(id)
    setPanelOpen(true)
  }

  const closePanel = () => {
    setPanelOpen(false)
    setIsImageCover(false)
    setBackgroundPosition({ x: 0, y: 0 })
  }

  const handlePanelMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingPanel(true)
    setStartPosition({
      x: event.clientX,
      y: event.clientY,
    })
  }

  const handlePanelMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingPanel) return

    const deltaX = event.clientX - startPosition.x
    const deltaY = event.clientY - startPosition.y
    setBackgroundPosition((prevPos) => ({
      x: prevPos.x + deltaX,
      y: prevPos.y + deltaY,
    }))
    setStartPosition({
      x: event.clientX,
      y: event.clientY,
    })
  }

  const handlePanelMouseUp = () => {
    setIsDraggingPanel(false)
  }

  const renderBackgroundPosition = () => {
    const posX = `calc(50% + ${backgroundPosition.x}px)`
    const posY = `calc(50% + ${backgroundPosition.y}px)`
    return `${posX} ${posY}`
  }

  const bringCardToFront = (id: string) => {
    setPositions((prev) => {
      const highestZ = Object.values(prev).reduce((max, position) => Math.max(max, position.z), 0)
      const target = prev[id]
      if (!target) return prev

      return {
        ...prev,
        [id]: {
          ...target,
          z: highestZ + 1,
        },
      }
    })
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>, id: string) => {
    const cardPosition = positions[id]
    const container = containerRef.current
    if (!cardPosition || !container) return

    const containerRect = container.getBoundingClientRect()
    dragStateRef.current = {
      id,
      pointerOffsetX: event.clientX - containerRect.left - cardPosition.x,
      pointerOffsetY: event.clientY - containerRect.top - cardPosition.y,
      moved: false,
    }
    bringCardToFront(id)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current
    const container = containerRef.current
    if (!dragState || !container) return

    const containerRect = container.getBoundingClientRect()
    const rawX = event.clientX - containerRect.left - dragState.pointerOffsetX
    const rawY = event.clientY - containerRect.top - dragState.pointerOffsetY
    const maxX = Math.max(CARD_PADDING, containerRect.width - CARD_WIDTH - CARD_PADDING)
    const maxY = Math.max(CARD_PADDING, containerRect.height - CARD_HEIGHT - CARD_PADDING)

    if (Math.abs(rawX - positions[dragState.id].x) > 2 || Math.abs(rawY - positions[dragState.id].y) > 2) {
      dragStateRef.current = { ...dragState, moved: true }
    }

    setPositions((prev) => ({
      ...prev,
      [dragState.id]: {
        ...prev[dragState.id],
        x: clamp(rawX, CARD_PADDING, maxX),
        y: clamp(rawY, CARD_PADDING, maxY),
      },
    }))
  }

  const handlePointerUp = () => {
    const dragState = dragStateRef.current
    if (!dragState) return

    if (!dragState.moved) {
      const selected = postcards.find((postcard) => postcard.id === dragState.id)
      if (selected) {
        pickImage(selected.src, selected.name, selected.id)
      }
    }
    dragStateRef.current = null
  }

  return (
    <section className="w-full h-screen p-0">
      <div className="w-full h-full bg-[#f4f1ea] overflow-hidden">
        <div ref={containerRef} className="relative h-full overflow-hidden touch-none">
          {postcards.map((postcard) => {
            const position = positions[postcard.id]
            if (!position) return null

            return (
              <div
                key={postcard.id}
                onPointerDown={(event) => handlePointerDown(event, postcard.id)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="absolute select-none cursor-grab active:cursor-grabbing w-[220px] h-[240px] rounded-lg border border-gray-200 bg-white p-3 shadow-md transition-shadow hover:shadow-lg"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotation}deg)`,
                  zIndex: position.z,
                }}
              >
                <div
                  className="w-full h-full rounded-md bg-center bg-cover bg-gray-100"
                  style={{ backgroundImage: `url(${postcard.src})` }}
                />
              </div>
            )
          })}
          {panelOpen && (
            <ImageDisplay
              imageUrl={previewUrl}
              onClose={closePanel}
              handleMouseDown={handlePanelMouseDown}
              handleMouseMove={handlePanelMouseMove}
              handleMouseUp={handlePanelMouseUp}
              isImageCover={isImageCover}
              setIsImageCover={setIsImageCover}
              renderBackgroundPosition={renderBackgroundPosition}
              setBackgroundPosition={setBackgroundPosition}
              imageTitle={imageTitle}
              id={selectedArtworkId}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default PostcardPlayground
