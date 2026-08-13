import type { LocationMetadata } from 'types/location'
import { Input } from '@ui'
import { useI18n } from 'libs/i18n'

export type SketchMetadataValue = {
  location?: LocationMetadata
  sketchDate?: string
  tags?: string[]
  isMapVisible?: boolean
}

type SketchMetadataFieldsProps = {
  value: SketchMetadataValue
  onChange: (value: SketchMetadataValue) => void
}

const parseCoordinate = (value: string) => {
  if (!value.trim()) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

const getTagsText = (tags?: string[]) => tags?.join(', ') || ''

const parseTagsText = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

const getCoordinateError = (label: string, value?: number) => {
  if (value === undefined) return ''
  if (!Number.isFinite(value)) return `${label} must be a number.`
  if (label === 'Latitude' && (value < -90 || value > 90)) return 'Latitude must be between -90 and 90.'
  if (label === 'Longitude' && (value < -180 || value > 180)) return 'Longitude must be between -180 and 180.'
  return ''
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-1 text-sm text-gray-700">
    <span className="font-bold">{label}</span>
    {children}
  </label>
)

const SketchMetadataFields = ({ value, onChange }: SketchMetadataFieldsProps) => {
  const location = value.location || {}
  const { t } = useI18n()
  const latitudeError = getCoordinateError('Latitude', location.latitude)
  const longitudeError = getCoordinateError('Longitude', location.longitude)

  const updateLocation = (nextLocation: Partial<LocationMetadata>) => {
    onChange({
      ...value,
      location: {
        ...location,
        ...nextLocation,
      },
    })
  }

  return (
    <section className="my-6 border-t border-neutral-200 pt-5">
      <div className="mb-4">
        <h2 className="text-5 font-bold">{t('metadata.location')}</h2>
        <p className="mt-1 text-sm text-gray-500">{t('metadata.helper')}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('metadata.country')}>
          <Input value={location.country || ''} onValueChange={(country) => updateLocation({ country })} />
        </Field>
        <Field label={t('metadata.city')}>
          <Input value={location.city || ''} onValueChange={(city) => updateLocation({ city })} />
        </Field>
        <Field label={t('metadata.placeName')}>
          <Input value={location.placeName || ''} onValueChange={(placeName) => updateLocation({ placeName })} />
        </Field>
        <Field label={t('metadata.sketchDate')}>
          <Input
            type="date"
            value={value.sketchDate || ''}
            onValueChange={(sketchDate) => onChange({ ...value, sketchDate })}
          />
        </Field>
        <Field label={t('metadata.latitude')}>
          <Input
            inputMode="decimal"
            value={location.latitude?.toString() || ''}
            onValueChange={(latitude) => updateLocation({ latitude: parseCoordinate(latitude) })}
          />
          {latitudeError && (
            <span className="text-xs text-primary-500">
              {latitudeError.includes('number') ? t('metadata.latitudeNumber') : t('metadata.latitudeRange')}
            </span>
          )}
        </Field>
        <Field label={t('metadata.longitude')}>
          <Input
            inputMode="decimal"
            value={location.longitude?.toString() || ''}
            onValueChange={(longitude) => updateLocation({ longitude: parseCoordinate(longitude) })}
          />
          {longitudeError && (
            <span className="text-xs text-primary-500">
              {longitudeError.includes('number') ? t('metadata.longitudeNumber') : t('metadata.longitudeRange')}
            </span>
          )}
        </Field>
      </div>
      <div className="mt-4 grid gap-4">
        <Field label={t('metadata.locationNote')}>
          <textarea
            value={location.locationNote || ''}
            onChange={(event) => updateLocation({ locationNote: event.target.value })}
            className="min-h-20 w-full resize-y rounded-1 border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-secondary-500"
          />
        </Field>
        <Field label={t('metadata.tags')}>
          <Input
            value={getTagsText(value.tags)}
            placeholder={t('metadata.tagsPlaceholder')}
            onValueChange={(tags) => onChange({ ...value, tags: parseTagsText(tags) })}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={value.isMapVisible !== false}
            onChange={(event) => onChange({ ...value, isMapVisible: event.target.checked })}
          />
          <span>{t('metadata.showOnMap')}</span>
        </label>
      </div>
    </section>
  )
}

export default SketchMetadataFields
