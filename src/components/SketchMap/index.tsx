import type { SketchMapItem } from 'types/location'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useI18n } from 'libs/i18n'
import MapView from './components/MapView'

type SketchMapProps = {
  items: SketchMapItem[]
}

const SketchMap = ({ items }: SketchMapProps) => {
  const hasItems = items.length > 0
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    if (!isMapFullscreen) return undefined

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMapFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMapFullscreen])

  return (
    <main className="mb-16">
      <div className="mb-8 max-w-3xl">
        <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('map.eyebrow')}</p>
        <h1 className="mb-4 text-9 font-semibold leading-tight sm:text-12">{t('map.title')}</h1>
        <p className="text-4 leading-relaxed text-gray-600 sm:text-5">{t('map.description')}</p>
      </div>
      {hasItems ? (
        <>
          <MapView items={items} isFullscreen={isMapFullscreen} onFullscreenChange={setIsMapFullscreen} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.detailUrl}
                className="rounded-2 border border-neutral-200 p-4 transition-shadow hover:shadow-hover"
              >
                <div className="mb-1 text-xs uppercase tracking-0.2em text-gray-500">{item.type}</div>
                <div className="font-bold">{item.title}</div>
                <div className="mt-1 text-sm text-gray-500">
                  {[item.placeName, item.city, item.country].filter(Boolean).join(' · ')}
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-2 border border-dashed border-neutral-300 px-6 py-12 text-center text-gray-500">
          {t('common.noMapItems')}
        </div>
      )}
    </main>
  )
}

export default SketchMap
