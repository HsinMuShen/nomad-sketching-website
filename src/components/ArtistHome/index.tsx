import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Artwork } from 'types/artworks'
import DefaultImage from 'public/images/default.png'
import { useI18n } from 'libs/i18n'
import ImageDisplay from 'components/CarouselArtworks/components/ImageDisplay'

const ArtistHome = ({ artworks }: { artworks: Artwork[] }) => {
  const sectionRefs = useRef<Array<HTMLElement | null>>([])
  const heroFadeTimeoutRef = useRef<number | null>(null)
  const [randomWorks, setRandomWorks] = useState<Artwork[]>([])

  const [isImageCover, setIsImageCover] = useState(false)
  const [selectedArtworkId, setSelectedArtworkId] = useState('')
  const [imageTitle, setImageTitle] = useState('')
  const [isDraggingPanel, setIsDraggingPanel] = useState(false)
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })

  const [heroIndex, setHeroIndex] = useState(0)
  const [heroFading, setHeroFading] = useState(false)
  /** 手機寬度（≤767px）：不輪播、不淡入淡出 */
  const [isMobileViewport, setIsMobileViewport] = useState<boolean | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const { t } = useI18n()

  const worksWithImage = useMemo(() => artworks.filter((a) => a.mainImage?.src), [artworks])

  const marqueeItems = useMemo(() => {
    if (randomWorks.length > 0) return randomWorks
    return worksWithImage
  }, [randomWorks, worksWithImage])

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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('artist-reveal-visible')
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (worksWithImage.length === 0) return

    const shuffled = [...worksWithImage]
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setRandomWorks(shuffled)
  }, [worksWithImage])

  useEffect(() => {
    if (marqueeItems.length === 0) return
    setHeroIndex(Math.floor(Math.random() * marqueeItems.length))
  }, [marqueeItems.length, randomWorks.length])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobileViewport(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const len = marqueeItems.length
    if (len <= 1) return
    if (isMobileViewport !== false) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const intervalId = window.setInterval(() => {
      if (heroFadeTimeoutRef.current) window.clearTimeout(heroFadeTimeoutRef.current)
      setHeroFading(true)
      heroFadeTimeoutRef.current = window.setTimeout(() => {
        heroFadeTimeoutRef.current = null
        setHeroIndex((prev) => {
          let next = Math.floor(Math.random() * len)
          let guard = 0
          while (next === prev && len > 1 && guard < 20) {
            next = Math.floor(Math.random() * len)
            guard += 1
          }
          return next
        })
        setHeroFading(false)
      }, 550)
    }, 5500)

    return () => {
      window.clearInterval(intervalId)
      if (heroFadeTimeoutRef.current) window.clearTimeout(heroFadeTimeoutRef.current)
    }
  }, [marqueeItems.length, isMobileViewport])

  useEffect(() => {
    if (heroIndex >= marqueeItems.length && marqueeItems.length > 0) {
      setHeroIndex(0)
    }
  }, [heroIndex, marqueeItems.length])

  const marqueeLoop = [...marqueeItems, ...marqueeItems]
  const heroArtwork = marqueeItems[heroIndex]

  const heroDesktopFade = isMobileViewport === false

  return (
    <main className="pb-10 sm:pb-14 lg:pb-20">
      {/* Section 1：左側文案、右側作品圖（僅 lg+ 顯示；點擊開 ImageDisplay） */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el
        }}
        className="artist-reveal mb-10 sm:mb-16 lg:mb-24 pt-4 grid lg:grid-cols-[1fr_minmax(260px,420px)] gap-10 lg:gap-14 items-start max-w-6xl mx-auto"
      >
        <div className="max-w-3xl">
          <p className="text-sm tracking-[0.2em] uppercase text-gray-500 mb-3">{t('home.eyebrow')}</p>
          <h1 className="text-10 sm:text-14 leading-tight font-semibold mb-4">{t('home.title')}</h1>
          <p className="text-xl sm:text-2xl text-gray-800 font-medium mb-6 leading-snug">{t('home.subtitle')}</p>
          <div className="text-gray-600 text-4 sm:text-5 leading-relaxed space-y-4">
            <p>{t('home.intro1')}</p>
            <p>{t('home.intro2')}</p>
            <p>{t('home.intro3')}</p>
          </div>
        </div>

        <div className="hidden lg:block w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
          {heroArtwork ? (
            <button
              type="button"
              onClick={() => pickImage(heroArtwork.mainImage!.src, heroArtwork.name, heroArtwork.id)}
              className="relative w-full aspect-[4/5] max-h-[min(72vh,520px)] rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-100 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              aria-label={`${t('imageDisplay.viewArtwork')}: ${heroArtwork.name}`}
            >
              <div
                className={`absolute inset-0 ${heroDesktopFade ? `artist-hero-fade ${heroFading ? 'opacity-0' : 'opacity-100'}` : 'opacity-100'}`}
              >
                <Image
                  src={heroArtwork.mainImage?.src || DefaultImage}
                  alt={heroArtwork.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 420px"
                  priority
                />
              </div>
            </button>
          ) : (
            <div className="relative w-full aspect-[4/5] rounded-2xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
              {t('home.noArtworkImage')}
            </div>
          )}
        </div>
      </section>

      {/* Section 2：精選作品跑馬燈（點擊開 ImageDisplay，不直接進作品頁） */}
      <section
        ref={(el) => {
          sectionRefs.current[1] = el
        }}
        className="artist-reveal mb-10 sm:mb-16 lg:mb-24 -mx-4 sm:-mx-6 lg:mx-0"
      >
        <div className="px-4 sm:px-6 lg:px-0 mb-4 flex items-end justify-between gap-4">
          <h2 className="text-7 sm:text-9 font-semibold">{t('home.featuredWorks')}</h2>
          <Link href="/artworks" className="text-sm text-gray-600 hover:text-black shrink-0 transition-colors">
            {t('home.enterArtworks')}
          </Link>
        </div>
        <div className="overflow-hidden w-full py-2">
          {marqueeItems.length === 0 ? (
            <p className="text-gray-500 text-center py-12 px-4">{t('home.noFeaturedWorks')}</p>
          ) : (
            <div className="artist-marquee-inner">
              {marqueeLoop.map((artwork, index) => (
                <button
                  key={`${artwork.id}-${index}`}
                  type="button"
                  onClick={() => pickImage(artwork.mainImage!.src, artwork.name, artwork.id)}
                  className="relative w-44 h-56 sm:w-52 sm:h-64 shrink-0 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  aria-label={`${t('imageDisplay.viewArtwork')}: ${artwork.name}`}
                >
                  <Image
                    src={artwork.mainImage?.src || DefaultImage}
                    alt={artwork.name || '作品'}
                    fill
                    className="object-cover pointer-events-none"
                    sizes="208px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 3：關於我的創作 */}
      <section
        ref={(el) => {
          sectionRefs.current[2] = el
        }}
        className="artist-reveal mb-10 sm:mb-14 lg:mb-20 max-w-3xl"
      >
        <h2 className="text-7 sm:text-9 font-semibold mb-4">{t('home.aboutCreationTitle')}</h2>
        <div className="text-gray-600 leading-relaxed space-y-4 mb-6">
          <p>{t('home.aboutCreation1')}</p>
          <p>{t('home.aboutCreation2')}</p>
          <p>{t('home.aboutCreation3')}</p>
          <p>{t('home.aboutCreation4')}</p>
        </div>
        <Link
          href="/artworks"
          className="inline-flex items-center text-black font-medium border-b border-black pb-0.5 hover:text-gray-700 hover:border-gray-700 transition-colors"
        >
          {t('home.goArtworks')}
        </Link>
      </section>

      {/* Section 4：日記與隨筆 */}
      <section
        ref={(el) => {
          sectionRefs.current[3] = el
        }}
        className="artist-reveal mb-10 sm:mb-14 lg:mb-20 max-w-3xl"
      >
        <h2 className="text-7 sm:text-9 font-semibold mb-4">{t('home.diaryEssayTitle')}</h2>
        <div className="text-gray-600 leading-relaxed space-y-4 mb-6">
          <p>{t('home.diaryEssay1')}</p>
          <p>{t('home.diaryEssay2')}</p>
          <p>{t('home.diaryEssay3')}</p>
          <p>{t('home.diaryEssay4')}</p>
        </div>
        <Link
          href="/diaries"
          className="inline-flex items-center text-black font-medium border-b border-black pb-0.5 hover:text-gray-700 hover:border-gray-700 transition-colors"
        >
          {t('home.goDiaries')}
        </Link>
      </section>

      {/* Section 5：線上繪圖 */}
      <section
        ref={(el) => {
          sectionRefs.current[4] = el
        }}
        className="artist-reveal max-w-3xl mb-0 pb-0"
      >
        <h2 className="text-7 sm:text-9 font-semibold mb-4">{t('home.onlineDrawingTitle')}</h2>
        <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6">{t('home.onlineDrawingDescription')}</p>
        <Link
          href="/drawing"
          className="inline-flex items-center text-black font-medium border-b border-black pb-0.5 hover:text-gray-700 hover:border-gray-700 transition-colors"
        >
          {t('home.openDrawing')}
        </Link>
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
