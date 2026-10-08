import type { Artwork } from 'types/artworks'
import type { DiaryType } from 'types/diary'
import Image from 'next/image'
import Link from 'next/link'
import Layout from 'components/Layout'
import DefaultImage from 'public/images/default.png'
import { useI18n } from 'libs/i18n'
import { DATA_BASE_NAMES } from 'constants/database'
import { readData } from 'utils/dataHandler'
import { normalizeSketchMapItems } from 'utils/sketchMap'
import { getArtworkName } from 'utils/localization/artwork'

type ProjectProps = {
  featuredArtwork: Artwork | null
  artworkCount: number
  diaryCount: number
  mappedCount: number
  cityCount: number
}

export async function getServerSideProps() {
  try {
    const [artworks, diaries] = await Promise.all([
      readData<Artwork>(DATA_BASE_NAMES.ARTWORKS),
      readData<DiaryType>(DATA_BASE_NAMES.DIARY),
    ])
    const mappedItems = normalizeSketchMapItems(artworks, diaries)
    const featuredArtwork = artworks.find((artwork) => artwork.mainImage?.src) || null

    return {
      props: {
        featuredArtwork,
        artworkCount: artworks.length,
        diaryCount: diaries.length,
        mappedCount: mappedItems.length,
        cityCount: new Set(mappedItems.map((item) => item.city).filter(Boolean)).size,
      },
    }
  } catch {
    return {
      props: {
        featuredArtwork: null,
        artworkCount: 0,
        diaryCount: 0,
        mappedCount: 0,
        cityCount: 0,
      },
    }
  }
}

const ProjectPage = ({ featuredArtwork, artworkCount, diaryCount, mappedCount, cityCount }: ProjectProps) => {
  const { t, locale } = useI18n()
  const featuredArtworkName = featuredArtwork ? getArtworkName(featuredArtwork, locale) : ''
  const place = [
    featuredArtwork?.location?.placeName,
    featuredArtwork?.location?.city,
    featuredArtwork?.location?.country,
  ]
    .filter(Boolean)
    .join(' · ')
  const coordinates =
    featuredArtwork?.location?.latitude && featuredArtwork.location.longitude
      ? `${featuredArtwork.location.latitude.toFixed(4)}, ${featuredArtwork.location.longitude.toFixed(4)}`
      : t('project.notRecorded')

  const steps = [
    { number: '01', title: t('project.visitTitle'), description: t('project.visitDescription') },
    { number: '02', title: t('project.sketchTitle'), description: t('project.sketchDescription') },
    { number: '03', title: t('project.recordTitle'), description: t('project.recordDescription') },
    { number: '04', title: t('project.returnTitle'), description: t('project.returnDescription') },
  ]

  const interfaceLinks = [
    { href: '/map', number: '01', title: t('project.mapLinkTitle'), description: t('project.mapLinkDescription') },
    {
      href: '/artworks',
      number: '02',
      title: t('project.archiveLinkTitle'),
      description: t('project.archiveLinkDescription'),
    },
    {
      href: '/journey',
      number: '03',
      title: t('project.encounterLinkTitle'),
      description: t('project.encounterLinkDescription'),
    },
  ]

  return (
    <Layout>
      <main className="mb-16">
        <section className="grid gap-10 pb-12 pt-4 sm:pb-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:items-end">
          <div>
            <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('project.eyebrow')}</p>
            <h1 className="mb-6 max-w-4xl text-10 font-semibold leading-tight sm:text-14">{t('project.title')}</h1>
            <p className="mb-6 max-w-3xl text-4 leading-relaxed text-gray-600 sm:text-5">{t('project.introduction')}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/map"
                className="inline-flex items-center rounded-1 bg-gray-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-700"
              >
                {t('project.openMap')}{' '}
                <span className="ml-2" aria-hidden="true">
                  ↗
                </span>
              </Link>
              <Link
                href="/artworks"
                className="inline-flex items-center rounded-1 border border-gray-900 px-4 py-3 text-sm font-bold transition-colors hover:bg-white"
              >
                {t('project.openArchive')}{' '}
                <span className="ml-2" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </div>
          </div>
          <aside className="rounded-2 border border-neutral-200 bg-white p-5 shadow-default sm:p-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-0.2em text-gray-500">{t('project.indexLabel')}</p>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-neutral-100 pb-3">
                <dt className="text-gray-500">{t('project.indexType')}</dt>
                <dd className="font-bold">{t('project.indexTypeValue')}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-neutral-100 pb-3">
                <dt className="text-gray-500">{t('project.indexAuthor')}</dt>
                <dd className="font-bold">Michael Shen</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">{t('project.indexStatus')}</dt>
                <dd className="font-bold">{t('project.indexStatusValue')}</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="mb-12 border-y border-neutral-300 py-8 sm:mb-16 sm:py-12">
          <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('project.questionLabel')}</p>
          <h2 className="max-w-5xl text-7 font-semibold leading-snug sm:text-10">{t('project.question')}</h2>
        </section>

        <section className="mb-12 grid gap-6 sm:mb-16 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [artworkCount, t('project.statWorks')],
            [diaryCount, t('project.statDiaries')],
            [mappedCount, t('project.statMapped')],
            [cityCount, t('project.statCities')],
          ].map(([value, label]) => (
            <div key={label} className="border-t-2 border-gray-900 pt-4">
              <div className="text-9 font-semibold leading-none sm:text-12">{value}</div>
              <div className="mt-2 text-xs uppercase tracking-0.15em text-gray-500">{label}</div>
            </div>
          ))}
        </section>

        <section className="mb-12 sm:mb-16">
          <div className="mb-6 max-w-3xl">
            <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('project.ruleLabel')}</p>
            <h2 className="mb-3 text-7 font-semibold sm:text-9">{t('project.ruleTitle')}</h2>
          </div>
          <div className="rounded-2 border border-neutral-200 bg-white p-6 shadow-default sm:p-10">
            <blockquote className="mb-5 max-w-4xl text-6 font-semibold leading-snug sm:text-9">
              {t('project.rule')}
            </blockquote>
            <p className="max-w-3xl leading-relaxed text-gray-600">{t('project.ruleDescription')}</p>
          </div>
        </section>

        <section className="mb-12 sm:mb-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('project.recordLabel')}</p>
              <h2 className="mb-3 text-7 font-semibold sm:text-9">{t('project.recordTitleLarge')}</h2>
              <p className="leading-relaxed text-gray-600">{t('project.recordDescriptionLarge')}</p>
            </div>
            {featuredArtwork && (
              <Link href={`/artwork/${featuredArtwork.id}`} className="text-sm font-bold underline underline-offset-4">
                {t('project.openRecord')} ↗
              </Link>
            )}
          </div>
          <div className="grid gap-6 rounded-2 border border-neutral-200 bg-white p-4 shadow-default sm:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] sm:p-6">
            <div className="relative min-h-72 bg-neutral-100 sm:min-h-100">
              <Image
                src={featuredArtwork?.mainImage?.src || DefaultImage}
                alt={featuredArtworkName || t('project.recordPlaceholder')}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 90vw, 55vw"
                priority
              />
            </div>
            <div className="flex flex-col justify-between p-2 sm:p-4">
              {featuredArtwork ? (
                <>
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-0.15em text-gray-500">{t('project.recordSource')}</p>
                    <h3 className="mb-6 text-6 font-semibold leading-snug sm:text-8">{featuredArtworkName}</h3>
                    <dl className="space-y-4 text-sm">
                      <div>
                        <dt className="mb-1 text-xs uppercase tracking-0.15em text-gray-500">
                          {t('project.fieldPlace')}
                        </dt>
                        <dd>{place || t('project.notRecorded')}</dd>
                      </div>
                      <div>
                        <dt className="mb-1 text-xs uppercase tracking-0.15em text-gray-500">
                          {t('project.fieldDate')}
                        </dt>
                        <dd>{featuredArtwork.sketchDate || t('project.notRecorded')}</dd>
                      </div>
                      <div>
                        <dt className="mb-1 text-xs uppercase tracking-0.15em text-gray-500">
                          {t('project.fieldCoordinates')}
                        </dt>
                        <dd className="font-mono text-xs">{coordinates}</dd>
                      </div>
                      <div>
                        <dt className="mb-1 text-xs uppercase tracking-0.15em text-gray-500">
                          {t('project.fieldTags')}
                        </dt>
                        <dd>{featuredArtwork.tags?.join(', ') || t('project.notRecorded')}</dd>
                      </div>
                    </dl>
                  </div>
                  <p className="mt-8 border-t border-neutral-200 pt-4 text-sm leading-relaxed text-gray-600">
                    {t('project.recordSourceNote')}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">{t('project.recordPlaceholder')}</p>
              )}
            </div>
          </div>
        </section>

        <section className="mb-12 sm:mb-16">
          <div className="mb-6 max-w-3xl">
            <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('project.systemLabel')}</p>
            <h2 className="mb-3 text-7 font-semibold sm:text-9">{t('project.systemTitle')}</h2>
            <p className="leading-relaxed text-gray-600">{t('project.systemDescription')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article key={step.number} className="rounded-2 border border-neutral-200 bg-white p-5 shadow-default">
                <div className="mb-8 text-sm font-bold text-gray-400">{step.number}</div>
                <h3 className="mb-2 text-5 font-bold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 sm:mb-16">
          <div className="mb-6 max-w-3xl">
            <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('project.interfaceLabel')}</p>
            <h2 className="mb-3 text-7 font-semibold sm:text-9">{t('project.interfaceTitle')}</h2>
            <p className="leading-relaxed text-gray-600">{t('project.interfaceDescription')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {interfaceLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2 border border-neutral-200 bg-white p-5 shadow-default transition-shadow hover:shadow-hover"
              >
                <div className="mb-8 text-sm font-bold text-gray-400">{item.number}</div>
                <h3 className="mb-2 text-5 font-bold group-hover:underline">{item.title} ↗</h3>
                <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12 grid gap-5 sm:mb-16 lg:grid-cols-2">
          <article className="rounded-2 border border-neutral-200 p-6 sm:p-8">
            <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('project.limitationLabel')}</p>
            <h2 className="mb-3 text-6 font-semibold sm:text-7">{t('project.limitationTitle')}</h2>
            <p className="leading-relaxed text-gray-600">{t('project.limitationDescription')}</p>
          </article>
          <article className="rounded-2 border border-neutral-200 p-6 sm:p-8">
            <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('project.nextLabel')}</p>
            <h2 className="mb-3 text-6 font-semibold sm:text-7">{t('project.nextTitle')}</h2>
            <p className="leading-relaxed text-gray-600">{t('project.nextDescription')}</p>
          </article>
        </section>

        <section className="border-t border-neutral-300 pt-8 sm:pt-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-sm uppercase tracking-0.2em text-gray-500">{t('project.roleLabel')}</p>
              <h2 className="text-6 font-semibold sm:text-7">{t('project.roleTitle')}</h2>
            </div>
            <p className="leading-relaxed text-gray-600">{t('project.roleDescription')}</p>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default ProjectPage
