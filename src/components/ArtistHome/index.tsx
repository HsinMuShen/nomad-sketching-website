import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { Artwork } from 'types/artworks'
import { useI18n } from 'libs/i18n'
import ImageDisplay from 'components/CarouselArtworks/components/ImageDisplay'
import { getArtworkName } from 'utils/localization/artwork'

const LANE_COUNT = 3
const MIN_LANE_ITEMS = 4

const ArtistHome = ({ artworks }: { artworks: Artwork[] }) => {
  const heroRef = useRef<HTMLElement | null>(null)
  const [shuffledWorks, setShuffledWorks] = useState<Artwork[]>([])

  const [isImageCover, setIsImageCover] = useState(false)
  const [selectedArtworkId, setSelectedArtworkId] = useState('')
  const [imageTitle, setImageTitle] = useState('')
  const [isDraggingPanel, setIsDraggingPanel] = useState(false)
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [panelOpen, setPanelOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [showArtworkWall, setShowArtworkWall] = useState(false)
  const { t, locale } = useI18n()

  const worksWithImage = useMemo(() => artworks.filter((artwork) => artwork.mainImage?.src), [artworks])
  const displayWorks = shuffledWorks.length > 0 ? shuffledWorks : worksWithImage

  const artworkLanes = useMemo(() => {
    if (displayWorks.length === 0) return []

    return Array.from({ length: LANE_COUNT }, (_, laneIndex) => {
      const laneWorks = displayWorks.filter((_, index) => index % LANE_COUNT === laneIndex)
      const source = laneWorks.length > 0 ? laneWorks : displayWorks
      const length = Math.max(MIN_LANE_ITEMS, source.length)
      const filledLane = Array.from({ length }, (_, index) => source[index % source.length])

      return [...filledLane, ...filledLane]
    })
  }, [displayWorks])

  const pickImage = useCallback((imgUrl: string, name: string, id: string) => {
    setPreviewUrl(imgUrl)
    setBackgroundPosition({ x: 0, y: 0 })
    setImageTitle(name)
    setSelectedArtworkId(id)
    setPanelOpen(true)
  }, [])

  const closePanel = useCallback(() => {
    setPanelOpen(false)
    setIsImageCover(false)
    setBackgroundPosition({ x: 0, y: 0 })
  }, [])

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

  useEffect(() => {
    if (worksWithImage.length === 0) return

    const shuffled = [...worksWithImage]
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
      ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
    }
    setShuffledWorks(shuffled)
  }, [worksWithImage])

  useEffect(() => {
    const revealTimeout = window.setTimeout(() => setShowArtworkWall(true), 1000)
    return () => window.clearTimeout(revealTimeout)
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const tracks = Array.from(hero.querySelectorAll<HTMLElement>('.nomad-home-lane-track'))
    let currentRate = 1
    let decayFrame: number | null = null

    const setPlaybackRate = (rate: number) => {
      tracks.forEach((track) => {
        track.getAnimations().forEach((animation) => {
          animation.playbackRate = rate
        })
      })
    }

    const decayPlaybackRate = () => {
      currentRate += (1 - currentRate) * 0.08

      if (currentRate <= 1.02) {
        currentRate = 1
        setPlaybackRate(currentRate)
        decayFrame = null
        return
      }

      setPlaybackRate(currentRate)
      decayFrame = window.requestAnimationFrame(decayPlaybackRate)
    }

    const handleWheel = (event: WheelEvent) => {
      const boost = Math.min(2.4, Math.abs(event.deltaY) / 90)
      currentRate = Math.min(6, Math.max(1, currentRate) + boost)
      setPlaybackRate(currentRate)

      if (decayFrame === null) {
        decayFrame = window.requestAnimationFrame(decayPlaybackRate)
      }
    }

    hero.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      hero.removeEventListener('wheel', handleWheel)
      if (decayFrame !== null) window.cancelAnimationFrame(decayFrame)
      setPlaybackRate(1)
    }
  }, [artworkLanes.length])

  return (
    <main>
      <section ref={heroRef} className="nomad-home-hero" aria-labelledby="nomad-home-title">
        <div className="nomad-home-title-lockup">
          <h1 id="nomad-home-title" className="nomad-home-title">
            Nomad Sketching
          </h1>
        </div>

        {artworkLanes.length > 0 ? (
          <div
            className={`nomad-home-collage ${showArtworkWall ? 'nomad-home-collage--visible' : ''}`}
            aria-label={t('home.featuredWorks')}
            aria-hidden={!showArtworkWall}
          >
            {artworkLanes.map((lane, laneIndex) => (
              <div key={laneIndex} className={`nomad-home-lane nomad-home-lane--${laneIndex + 1}`}>
                <div className="nomad-home-lane-track">
                  {lane.map((artwork, index) => {
                    const artworkName = getArtworkName(artwork, locale)
                    const isDuplicate = index >= lane.length / 2

                    return (
                      <button
                        key={`${laneIndex}-${artwork.id}-${index}`}
                        type="button"
                        className="nomad-home-artwork"
                        onClick={() => pickImage(artwork.mainImage!.src, artworkName, artwork.id)}
                        aria-label={`${t('imageDisplay.viewArtwork')}: ${artworkName}`}
                        aria-hidden={isDuplicate || undefined}
                        tabIndex={isDuplicate || !showArtworkWall ? -1 : 0}
                      >
                        <Image
                          src={artwork.mainImage!.src}
                          alt={isDuplicate ? '' : artworkName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 767px) 46vw, (max-width: 1200px) 26vw, 320px"
                          priority={laneIndex === 0 && index === 0}
                        />
                        <span className="nomad-home-artwork-label">
                          <span>{artworkName}</span>
                          <span aria-hidden="true">↗</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="nomad-home-empty">{t('home.noFeaturedWorks')}</div>
        )}
      </section>

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
    </main>
  )
}

export default ArtistHome
