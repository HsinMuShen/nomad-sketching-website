import type { Artwork } from 'types/artworks'
import type { DiaryType } from 'types/diary'
import type { SketchMapItem } from 'types/location'

const hasValidCoordinate = (latitude?: number, longitude?: number) => {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return false
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
}

const shouldShowOnMap = (item: { isMapVisible?: boolean }) => item.isMapVisible !== false

const withOptionalMapFields = (
  item: SketchMapItem,
  optionalFields: Partial<
    Pick<SketchMapItem, 'country' | 'city' | 'placeName' | 'sketchDate' | 'locationNote' | 'tags'>
  >,
) => {
  const normalizedItem = { ...item }

  Object.entries(optionalFields).forEach(([key, value]) => {
    if (value === undefined) return
    if (Array.isArray(value) && value.length === 0) return
    normalizedItem[key as keyof SketchMapItem] = value as never
  })

  return normalizedItem
}

export const normalizeArtworksForMap = (artworks: Artwork[]): SketchMapItem[] =>
  artworks
    .filter((artwork) => shouldShowOnMap(artwork))
    .filter((artwork) => hasValidCoordinate(artwork.location?.latitude, artwork.location?.longitude))
    .map((artwork) =>
      withOptionalMapFields(
        {
          id: artwork.id,
          type: 'artwork',
          title: artwork.name,
          imageUrl: artwork.mainImage?.src || '',
          latitude: artwork.location!.latitude!,
          longitude: artwork.location!.longitude!,
          detailUrl: `/artwork/${artwork.id}`,
        },
        {
          country: artwork.location?.country,
          city: artwork.location?.city,
          placeName: artwork.location?.placeName,
          sketchDate: artwork.sketchDate,
          locationNote: artwork.location?.locationNote,
          tags: artwork.tags,
        },
      ),
    )

export const normalizeDiariesForMap = (diaries: DiaryType[]): SketchMapItem[] =>
  diaries
    .filter((diary) => shouldShowOnMap(diary))
    .filter((diary) => hasValidCoordinate(diary.location?.latitude, diary.location?.longitude))
    .map((diary) =>
      withOptionalMapFields(
        {
          id: diary.id,
          type: 'diary',
          title: diary.title,
          imageUrl: diary.drawingImage?.src || '',
          latitude: diary.location!.latitude!,
          longitude: diary.location!.longitude!,
          detailUrl: `/diary/${diary.id}`,
        },
        {
          country: diary.location?.country,
          city: diary.location?.city,
          placeName: diary.location?.placeName,
          sketchDate: diary.sketchDate,
          locationNote: diary.location?.locationNote,
          tags: diary.tags,
        },
      ),
    )

export const normalizeSketchMapItems = (artworks: Artwork[], diaries: DiaryType[]) => [
  ...normalizeArtworksForMap(artworks),
  ...normalizeDiariesForMap(diaries),
]

export const getRandomSketchMapItem = (items: SketchMapItem[], currentId?: string) => {
  if (items.length === 0) return null
  if (items.length === 1) return items[0]

  const candidates = items.filter((item) => item.id !== currentId)
  return candidates[Math.floor(Math.random() * candidates.length)]
}
