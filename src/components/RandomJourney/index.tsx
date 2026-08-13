import type { SketchMapItem } from 'types/location'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@ui'
import DefaultImage from 'public/images/default.png'
import { useI18n } from 'libs/i18n'
import { getRandomSketchMapItem } from 'utils/sketchMap'

type RandomJourneyProps = {
  items: SketchMapItem[]
  initialId?: string
}

const getPlaceLine = (item: SketchMapItem) => [item.city, item.country].filter(Boolean).join(', ')

const RandomJourney = ({ items, initialId }: RandomJourneyProps) => {
  const [selectedItem, setSelectedItem] = useState<SketchMapItem | null>(null)
  const [shuffleItem, setShuffleItem] = useState<SketchMapItem | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const { t } = useI18n()

  useEffect(() => {
    const initialItem = initialId ? items.find((item) => item.id === initialId) : null
    if (!initialItem) return
    setSelectedItem(initialItem)
    setHasStarted(true)
  }, [initialId, items])

  useEffect(
    () => () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    },
    [],
  )

  const drawJourney = () => {
    if (items.length === 0 || isDrawing) return

    setHasStarted(true)
    setIsDrawing(true)
    setShuffleItem(getRandomSketchMapItem(items, selectedItem?.id))

    if (intervalRef.current) window.clearInterval(intervalRef.current)
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)

    intervalRef.current = window.setInterval(() => {
      setShuffleItem((current) => getRandomSketchMapItem(items, current?.id))
    }, 90)

    timeoutRef.current = window.setTimeout(() => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      intervalRef.current = null
      setSelectedItem((current) => {
        const nextItem = getRandomSketchMapItem(items, current?.id)
        setShuffleItem(nextItem)
        return nextItem
      })
      setIsDrawing(false)
    }, 1300)
  }

  if (items.length === 0) {
    return (
      <main className="mb-16">
        <h1 className="mb-4 text-9 font-semibold sm:text-12">Random Journey</h1>
        <div className="rounded-2 border border-dashed border-neutral-300 px-6 py-12 text-center text-gray-500">
          {t('common.noJourneyItems')}
        </div>
      </main>
    )
  }

  const displayItem = isDrawing ? shuffleItem : selectedItem
  const showResult = hasStarted && Boolean(displayItem)
  const resultItem = showResult ? displayItem : null

  return (
    <main className="mb-16">
      <section className="grid min-h-[calc(100vh-9rem)] items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('journey.eyebrow')}</p>
          <h1 className="mb-4 text-10 font-semibold leading-tight sm:text-14">{t('journey.title')}</h1>
          <p className="mb-7 text-4 leading-relaxed text-gray-600 sm:text-5">{t('journey.description')}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button color="secondary" onClick={drawJourney} disabled={isDrawing}>
              {isDrawing ? t('journey.finding') : showResult ? t('journey.drawAnother') : t('journey.start')}
            </Button>
            <Link href="/map" className="border-b border-black pb-0.5 text-sm font-bold text-black hover:text-gray-600">
              {t('common.viewMap')}
            </Link>
          </div>
        </div>

        <div>
          <div
            className={`relative mb-6 h-96 w-full overflow-hidden rounded-2 border border-neutral-200 bg-white shadow-default transition-all duration-300 sm:h-[66vh] ${
              isDrawing ? 'journey-lottery-pulse' : ''
            }`}
          >
            {displayItem ? (
              <Image
                key={`${displayItem.type}-${displayItem.id}`}
                src={displayItem.imageUrl || DefaultImage}
                alt={displayItem.title}
                fill
                priority
                className={`object-contain transition-opacity duration-200 ${isDrawing ? 'opacity-75' : 'opacity-100'}`}
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                <div className="mb-4 text-7 font-semibold text-gray-800">{t('journey.readyTitle')}</div>
                <p className="max-w-sm text-sm leading-relaxed text-gray-500">{t('journey.readyDescription')}</p>
              </div>
            )}
            {isDrawing && (
              <div className="absolute inset-x-0 bottom-0 bg-white/85 px-4 py-3 text-center text-sm font-bold tracking-0.2em text-gray-600">
                {t('journey.shuffling')}
              </div>
            )}
          </div>

          {resultItem ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_180px]">
              <div>
                <div className="mb-2 text-xs uppercase tracking-0.2em text-gray-500">{resultItem.type}</div>
                <h2 className="mb-2 text-7 font-bold leading-snug sm:text-9">
                  {resultItem.placeName || resultItem.title}
                </h2>
                {getPlaceLine(resultItem) && <div className="text-4 text-gray-600">{getPlaceLine(resultItem)}</div>}
                {resultItem.sketchDate && <div className="mt-1 text-sm text-gray-500">{resultItem.sketchDate}</div>}
                {resultItem.locationNote && (
                  <p className="mt-5 max-w-3xl text-4 leading-relaxed text-gray-600">{resultItem.locationNote}</p>
                )}
              </div>
              <div className="flex flex-wrap items-start gap-3 lg:flex-col">
                <Link
                  href={resultItem.detailUrl}
                  className="border-b border-black pb-0.5 text-sm font-bold text-black hover:text-gray-600"
                >
                  {t('common.readFullStory')}
                </Link>
                <Link
                  href="/map"
                  className="border-b border-black pb-0.5 text-sm font-bold text-black hover:text-gray-600"
                >
                  {t('common.viewOnMap')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 text-sm text-gray-500 sm:grid-cols-3">
              <div className="border-t border-neutral-200 pt-3">{t('journey.step1')}</div>
              <div className="border-t border-neutral-200 pt-3">{t('journey.step2')}</div>
              <div className="border-t border-neutral-200 pt-3">{t('journey.step3')}</div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default RandomJourney
