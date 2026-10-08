import type { JSONContent } from '@tiptap/core'
import type { Artwork } from 'types/artworks'
import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from 'components/Layout'
import DefaultImage from 'public/images/default.png'
import SpatialMemoryViewer from 'components/SpatialMemoryViewer'
import PerspectiveAnnotationEditor from 'components/PerspectiveAnnotationEditor'
import { useI18n } from 'libs/i18n'
import { EMPTY_PERSPECTIVE_ANNOTATION, type PerspectiveAnnotation } from 'types/spatialMemory'
import { getArtworkContent, getArtworkName } from 'utils/localization/artwork'

type GenerationStatus = 'idle' | 'preparing' | 'generating' | 'loading' | 'ready' | 'failed'

type SpatialMemoryPageProps = {
  artworks: Artwork[]
}

const PERSPECTIVE_STORAGE_KEY = 'nomad-spatial-memory-perspective-v1'

const getObservation = (content: JSONContent | null | undefined) => {
  const text: string[] = []
  const visit = (node: JSONContent | undefined) => {
    if (!node) return
    if (typeof node.text === 'string') text.push(node.text)
    node.content?.forEach(visit)
  }
  visit(content || undefined)
  return text.join(' ').replace(/\s+/g, ' ').trim()
}

const getPlace = (artwork: Artwork) =>
  [artwork.location?.placeName, artwork.location?.city, artwork.location?.country].filter(Boolean).join(' · ')

const statusLabelKey: Record<GenerationStatus, string> = {
  idle: 'spatialMemory.statusIdle',
  preparing: 'spatialMemory.statusPreparing',
  generating: 'spatialMemory.statusGenerating',
  loading: 'spatialMemory.statusLoading',
  ready: 'spatialMemory.statusReady',
  failed: 'spatialMemory.statusFailed',
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/project',
      permanent: false,
    },
  }
}

const SpatialMemoryPage = ({ artworks }: SpatialMemoryPageProps) => {
  const { t, locale } = useI18n()
  const router = useRouter()
  const timersRef = useRef<number[]>([])
  const [selectedId, setSelectedId] = useState(artworks[0]?.id || '')
  const [mobileView, setMobileView] = useState<'source' | 'interpretation'>('source')
  const [annotations, setAnnotations] = useState<string[]>([])
  const [annotationDraft, setAnnotationDraft] = useState('')
  const [perspectiveById, setPerspectiveById] = useState<Record<string, PerspectiveAnnotation>>({})
  const [perspectiveStorageReady, setPerspectiveStorageReady] = useState(false)
  const [statusById, setStatusById] = useState<Record<string, GenerationStatus>>({})

  useEffect(() => {
    if (!router.isReady || typeof router.query.artwork !== 'string') return
    if (artworks.some((artwork) => artwork.id === router.query.artwork)) setSelectedId(router.query.artwork)
  }, [artworks, router.isReady, router.query.artwork])

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
    },
    [],
  )

  useEffect(() => {
    try {
      const storedAnnotations = window.localStorage.getItem(PERSPECTIVE_STORAGE_KEY)
      if (storedAnnotations) setPerspectiveById(JSON.parse(storedAnnotations) as Record<string, PerspectiveAnnotation>)
    } catch {
      // Ignore malformed or unavailable browser storage and keep the editor usable.
    } finally {
      setPerspectiveStorageReady(true)
    }
  }, [])

  useEffect(() => {
    if (!perspectiveStorageReady) return
    try {
      window.localStorage.setItem(PERSPECTIVE_STORAGE_KEY, JSON.stringify(perspectiveById))
    } catch {
      // Annotation remains available in the current session if storage is unavailable.
    }
  }, [perspectiveById, perspectiveStorageReady])

  const selectedArtwork = useMemo(
    () => artworks.find((artwork) => artwork.id === selectedId) || artworks[0] || null,
    [artworks, selectedId],
  )
  const selectedStatus = selectedArtwork ? statusById[selectedArtwork.id] || 'idle' : 'idle'
  const selectedPerspective = selectedArtwork
    ? perspectiveById[selectedArtwork.id] || EMPTY_PERSPECTIVE_ANNOTATION
    : EMPTY_PERSPECTIVE_ANNOTATION
  const isPerspectiveReady =
    selectedPerspective.horizonY !== null &&
    selectedPerspective.vanishingPoints.length > 0 &&
    selectedPerspective.facadePoints.length === 4
  const observation = selectedArtwork ? getObservation(getArtworkContent(selectedArtwork, locale)) : ''
  const hasLocation = Boolean(getPlace(selectedArtwork || ({ location: undefined } as Artwork)))
  const hasDate = Boolean(selectedArtwork?.sketchDate)

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
  }

  const updateStatus = (artworkId: string, status: GenerationStatus) => {
    setStatusById((current) => ({ ...current, [artworkId]: status }))
  }

  const updatePerspective = (artworkId: string, nextValue: PerspectiveAnnotation) => {
    clearTimers()
    setPerspectiveById((current) => ({ ...current, [artworkId]: nextValue }))
    updateStatus(artworkId, 'idle')
  }

  const generateInterpretation = () => {
    if (
      !selectedArtwork ||
      selectedStatus === 'preparing' ||
      selectedStatus === 'generating' ||
      selectedStatus === 'loading'
    ) {
      return
    }

    clearTimers()
    const artworkId = selectedArtwork.id
    if (!isPerspectiveReady) return
    updateStatus(artworkId, 'preparing')
    timersRef.current.push(window.setTimeout(() => updateStatus(artworkId, 'generating'), 700))
    timersRef.current.push(window.setTimeout(() => updateStatus(artworkId, 'loading'), 1900))
    timersRef.current.push(
      window.setTimeout(() => {
        updateStatus(artworkId, 'ready')
      }, 3000),
    )
  }

  const addAnnotation = () => {
    const value = annotationDraft.trim()
    if (!value) return
    setAnnotations((current) => [...current, value])
    setAnnotationDraft('')
  }

  const sourcePanel = selectedArtwork ? (
    <div className="overflow-hidden rounded-2 border border-neutral-200 bg-white shadow-default">
      <div className="relative h-80 bg-neutral-100 sm:h-100">
        <Image
          src={selectedArtwork.mainImage?.src || DefaultImage}
          alt={getArtworkName(selectedArtwork, locale)}
          fill
          priority
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="p-5 sm:p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-0.15em text-gray-500">
          {t('spatialMemory.sourceLabel')}
        </p>
        <h2 className="mb-4 text-6 font-semibold leading-snug sm:text-7">{getArtworkName(selectedArtwork, locale)}</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="mb-1 text-xs uppercase tracking-0.12em text-gray-500">{t('spatialMemory.place')}</dt>
            <dd>{getPlace(selectedArtwork) || t('spatialMemory.notRecorded')}</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs uppercase tracking-0.12em text-gray-500">{t('spatialMemory.date')}</dt>
            <dd>{selectedArtwork.sketchDate || t('spatialMemory.notRecorded')}</dd>
          </div>
        </dl>
        <div className="mt-5 border-t border-neutral-200 pt-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-0.12em text-gray-500">
            {t('spatialMemory.observation')}
          </p>
          <p className="text-sm leading-relaxed text-gray-600">
            {observation || t('spatialMemory.observationMissing')}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex min-h-80 items-center justify-center rounded-2 border border-dashed border-neutral-300 text-sm text-gray-500">
      {t('spatialMemory.noArtwork')}
    </div>
  )

  const interpretationPanel = selectedArtwork ? (
    <div className="overflow-hidden rounded-2 border border-neutral-200 bg-white shadow-default">
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 sm:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-0.15em text-gray-500">
            {t('spatialMemory.interpretationLabel')}
          </p>
          <p className="mt-1 text-sm font-semibold">{t(statusLabelKey[selectedStatus])}</p>
        </div>
        {selectedStatus === 'ready' && (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-gray-600">
            {t('spatialMemory.sampleTag')}
          </span>
        )}
      </div>
      <div className="h-80 sm:h-100">
        {selectedStatus === 'ready' ? (
          <SpatialMemoryViewer t={t} annotation={selectedPerspective} />
        ) : selectedStatus === 'idle' ? (
          <div className="flex h-full items-center justify-center bg-[#f7f7f5] p-8 text-center">
            <div className="max-w-xs">
              <p className="mb-2 text-sm font-bold uppercase tracking-0.15em text-gray-500">
                {t('spatialMemory.geometryWaitingTitle')}
              </p>
              <p className="text-sm leading-relaxed text-gray-600">{t('spatialMemory.geometryWaitingDescription')}</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-[#f7f7f5] p-8 text-center">
            <div className="max-w-xs">
              <div className="mx-auto mb-5 h-10 w-10 animate-pulse rounded-full border-2 border-gray-300" />
              <p className="mb-2 text-sm font-bold">{t(statusLabelKey[selectedStatus])}</p>
              <p className="text-sm leading-relaxed text-gray-500">{t('spatialMemory.asyncDescription')}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 px-5 py-4 sm:px-6">
        <p className="max-w-sm text-xs leading-relaxed text-gray-500">
          {t(isPerspectiveReady ? 'spatialMemory.previewNote' : 'spatialMemory.buildRequirement')}
        </p>
        <button
          type="button"
          onClick={generateInterpretation}
          disabled={
            !isPerspectiveReady ||
            selectedStatus === 'preparing' ||
            selectedStatus === 'generating' ||
            selectedStatus === 'loading'
          }
          className="min-h-11 rounded-1 bg-gray-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {selectedStatus === 'ready' ? t('spatialMemory.regenerate') : t('spatialMemory.generate')}
        </button>
      </div>
    </div>
  ) : null

  return (
    <Layout>
      <main className="mb-20 min-w-0 overflow-x-hidden">
        <section className="grid min-w-0 gap-10 pb-12 pt-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:items-end">
          <div className="min-w-0">
            <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('spatialMemory.eyebrow')}</p>
            <h1 className="mb-6 max-w-4xl break-words text-10 font-semibold leading-tight sm:text-14">
              {t('spatialMemory.title')}
            </h1>
            <p className="max-w-3xl text-4 leading-relaxed text-gray-600 sm:text-5">
              {t('spatialMemory.introduction')}
            </p>
          </div>
          <aside className="min-w-0 rounded-2 border border-neutral-200 bg-white p-5 shadow-default sm:p-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-0.2em text-gray-500">
              {t('spatialMemory.questionLabel')}
            </p>
            <p className="text-5 font-semibold leading-snug">{t('spatialMemory.question')}</p>
          </aside>
        </section>

        <section className="mb-12 border-y border-neutral-300 py-8 sm:mb-16 sm:py-12">
          <div className="grid min-w-0 gap-8 lg:grid-cols-3">
            <div className="min-w-0">
              <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('spatialMemory.methodLabel')}</p>
              <h2 className="break-words text-7 font-semibold sm:text-9">{t('spatialMemory.methodTitle')}</h2>
            </div>
            <p className="leading-relaxed text-gray-600 lg:col-span-2">{t('spatialMemory.methodDescription')}</p>
          </div>
        </section>

        <section className="mb-12 sm:mb-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('spatialMemory.galleryLabel')}</p>
              <h2 className="text-7 font-semibold sm:text-9">{t('spatialMemory.galleryTitle')}</h2>
            </div>
            <p className="text-sm text-gray-500">
              {artworks.length} / 5 {t('spatialMemory.selectedCount')}
            </p>
          </div>
          {artworks.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {artworks.map((artwork) => {
                const isSelected = artwork.id === selectedArtwork?.id
                return (
                  <button
                    key={artwork.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(artwork.id)
                      setMobileView('source')
                    }}
                    className={`group overflow-hidden rounded-2 border text-left transition-shadow hover:shadow-hover ${
                      isSelected ? 'border-gray-900 shadow-default' : 'border-neutral-200'
                    }`}
                  >
                    <div className="relative h-36 bg-neutral-100">
                      <Image
                        src={artwork.mainImage?.src || DefaultImage}
                        alt={getArtworkName(artwork, locale)}
                        fill
                        className="object-contain"
                        sizes="20vw"
                      />
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-2 text-sm font-bold leading-snug">{getArtworkName(artwork, locale)}</p>
                      <p className="mt-2 truncate text-xs text-gray-500">
                        {getPlace(artwork) || t('spatialMemory.notRecorded')}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2 border border-dashed border-neutral-300 px-6 py-12 text-center text-gray-500">
              {t('spatialMemory.noArtwork')}
            </div>
          )}
        </section>

        {selectedArtwork && (
          <section className="mb-12 sm:mb-16">
            <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(240px,0.75fr)] lg:items-end">
              <div>
                <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">
                  {t('spatialMemory.annotationEditorEyebrow')}
                </p>
                <h2 className="text-7 font-semibold sm:text-9">{t('spatialMemory.annotationEditorTitle')}</h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{t('spatialMemory.annotationEditorIntro')}</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(240px,0.75fr)] lg:items-start">
              <PerspectiveAnnotationEditor
                imageSrc={selectedArtwork.mainImage?.src || DefaultImage.src}
                imageAlt={getArtworkName(selectedArtwork, locale)}
                value={selectedPerspective}
                onChange={(nextValue) => updatePerspective(selectedArtwork.id, nextValue)}
                t={t}
              />
              <aside className="rounded-2 border border-neutral-200 bg-white p-5 shadow-default sm:p-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-0.15em text-gray-500">
                  {t('spatialMemory.annotationEditorChecklistLabel')}
                </p>
                <h3 className="mb-4 text-5 font-semibold">{t('spatialMemory.annotationEditorChecklistTitle')}</h3>
                <ul className="space-y-3 text-sm leading-relaxed text-gray-600">
                  <li className={selectedPerspective.horizonY === null ? 'text-gray-500' : 'font-bold text-gray-900'}>
                    {selectedPerspective.horizonY === null ? '○' : '●'} {t('spatialMemory.checkHorizon')}
                  </li>
                  <li
                    className={
                      selectedPerspective.vanishingPoints.length === 0 ? 'text-gray-500' : 'font-bold text-gray-900'
                    }
                  >
                    {selectedPerspective.vanishingPoints.length === 0 ? '○' : '●'}{' '}
                    {t('spatialMemory.checkVanishingPoint')}
                  </li>
                  <li
                    className={
                      selectedPerspective.facadePoints.length !== 4 ? 'text-gray-500' : 'font-bold text-gray-900'
                    }
                  >
                    {selectedPerspective.facadePoints.length !== 4 ? '○' : '●'} {t('spatialMemory.checkFacade')}
                  </li>
                </ul>
                <p className="mt-5 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-gray-500">
                  {t('spatialMemory.annotationEditorEvidenceNote')}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-gray-500">{t('spatialMemory.annotationStorageNote')}</p>
              </aside>
            </div>
          </section>
        )}

        {selectedArtwork && (
          <section className="mb-12 sm:mb-16">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('spatialMemory.viewerLabel')}</p>
                <h2 className="text-7 font-semibold sm:text-9">{t('spatialMemory.viewerTitle')}</h2>
              </div>
              <Link href={`/artwork/${selectedArtwork.id}`} className="text-sm font-bold underline underline-offset-4">
                {t('spatialMemory.openOriginal')} ↗
              </Link>
            </div>

            <div className="mb-4 flex rounded-1 border border-neutral-200 bg-white p-1 lg:hidden">
              <button
                type="button"
                className={`min-h-11 flex-1 rounded-1 px-3 text-sm font-bold ${mobileView === 'source' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
                onClick={() => setMobileView('source')}
              >
                {t('spatialMemory.sourceTab')}
              </button>
              <button
                type="button"
                className={`min-h-11 flex-1 rounded-1 px-3 text-sm font-bold ${mobileView === 'interpretation' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
                onClick={() => setMobileView('interpretation')}
              >
                {t('spatialMemory.interpretationTab')}
              </button>
            </div>

            <div className="lg:hidden">{mobileView === 'source' ? sourcePanel : interpretationPanel}</div>
            <div className="hidden gap-5 lg:grid lg:grid-cols-2">
              {sourcePanel}
              {interpretationPanel}
            </div>
          </section>
        )}

        <section className="mb-12 grid gap-5 sm:mb-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('spatialMemory.legendLabel')}</p>
            <h2 className="text-7 font-semibold sm:text-9">{t('spatialMemory.legendTitle')}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['spatialMemory.observed', 'spatialMemory.observedDescription', 'border-gray-900'],
              ['spatialMemory.inferred', 'spatialMemory.inferredDescription', 'border-gray-400'],
              ['spatialMemory.unknown', 'spatialMemory.unknownDescription', 'border-dashed border-gray-400'],
            ].map(([labelKey, descriptionKey, borderClass]) => (
              <article key={labelKey} className={`border-t-2 ${borderClass} pt-3`}>
                <h3 className="mb-2 text-sm font-bold">{t(labelKey)}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{t(descriptionKey)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 grid gap-5 sm:mb-16 lg:grid-cols-2">
          <article className="rounded-2 border border-neutral-200 bg-white p-6 shadow-default sm:p-8">
            <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('spatialMemory.recordLabel')}</p>
            <h2 className="mb-5 text-6 font-semibold sm:text-7">{t('spatialMemory.recordTitle')}</h2>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between gap-5 border-b border-neutral-100 pb-3">
                <dt className="text-gray-500">{t('spatialMemory.recordSource')}</dt>
                <dd className="text-right font-bold">{selectedArtwork?.id || t('spatialMemory.notRecorded')}</dd>
              </div>
              <div className="flex justify-between gap-5 border-b border-neutral-100 pb-3">
                <dt className="text-gray-500">{t('spatialMemory.recordService')}</dt>
                <dd className="text-right font-bold">{t('spatialMemory.recordServiceValue')}</dd>
              </div>
              <div className="flex justify-between gap-5 border-b border-neutral-100 pb-3">
                <dt className="text-gray-500">{t('spatialMemory.recordModel')}</dt>
                <dd className="text-right font-bold">{t('spatialMemory.recordModelValue')}</dd>
              </div>
              <div className="flex justify-between gap-5">
                <dt className="text-gray-500">{t('spatialMemory.recordStatus')}</dt>
                <dd className="text-right font-bold">{t(statusLabelKey[selectedStatus])}</dd>
              </div>
            </dl>
            <p className="mt-5 text-sm leading-relaxed text-gray-600">{t('spatialMemory.recordDescription')}</p>
          </article>

          <article className="rounded-2 border border-neutral-200 bg-white p-6 shadow-default sm:p-8">
            <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('spatialMemory.annotationLabel')}</p>
            <h2 className="mb-3 text-6 font-semibold sm:text-7">{t('spatialMemory.annotationTitle')}</h2>
            <p className="mb-5 text-sm leading-relaxed text-gray-600">{t('spatialMemory.annotationDescription')}</p>
            <div className="mb-4 space-y-2">
              {annotations.length > 0 ? (
                annotations.map((annotation, index) => (
                  <div
                    key={`${annotation}-${index}`}
                    className="border-l-2 border-gray-900 pl-3 text-sm leading-relaxed"
                  >
                    {annotation}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">{t('spatialMemory.noAnnotations')}</p>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <textarea
                value={annotationDraft}
                onChange={(event) => setAnnotationDraft(event.target.value)}
                placeholder={t('spatialMemory.annotationPlaceholder')}
                className="min-h-11 flex-1 resize-y rounded-1 border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                aria-label={t('spatialMemory.annotationPlaceholder')}
              />
              <button
                type="button"
                onClick={addAnnotation}
                className="min-h-11 rounded-1 border border-gray-900 px-4 py-2 text-sm font-bold hover:bg-neutral-100"
              >
                {t('spatialMemory.addAnnotation')}
              </button>
            </div>
          </article>
        </section>

        <section className="grid gap-5 border-t border-neutral-300 pt-8 sm:pt-10 lg:grid-cols-2">
          <article>
            <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('spatialMemory.reflectionLabel')}</p>
            <h2 className="mb-3 text-6 font-semibold sm:text-7">{t('spatialMemory.reflectionTitle')}</h2>
            <p className="leading-relaxed text-gray-600">{t('spatialMemory.reflectionDescription')}</p>
          </article>
          <article>
            <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('spatialMemory.limitationsLabel')}</p>
            <h2 className="mb-3 text-6 font-semibold sm:text-7">{t('spatialMemory.limitationsTitle')}</h2>
            <p className="leading-relaxed text-gray-600">{t('spatialMemory.limitationsDescription')}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-gray-600">
              <span className={`rounded-full border px-3 py-1 ${hasLocation ? 'border-gray-300' : 'border-gray-900'}`}>
                {t('spatialMemory.locationField')}
              </span>
              <span className={`rounded-full border px-3 py-1 ${hasDate ? 'border-gray-300' : 'border-gray-900'}`}>
                {t('spatialMemory.dateField')}
              </span>
              <span className="rounded-full border border-gray-900 px-3 py-1">{t('spatialMemory.geometryField')}</span>
            </div>
          </article>
        </section>
      </main>
    </Layout>
  )
}

export default SpatialMemoryPage
