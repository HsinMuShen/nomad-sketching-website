import type { Artwork } from 'types/artworks'
import type { DiaryType } from 'types/diary'
import { getRandomSketchMapItem, normalizeSketchMapItems } from '.'

const artwork = {
  id: 'artwork-1',
  name: 'Taipei Station',
  mainImage: { id: 'taipei.jpg', src: 'https://example.com/taipei.jpg' },
  content: { type: 'doc', content: [] },
  location: {
    country: 'Taiwan',
    city: 'Taipei',
    placeName: 'Taipei Station',
    latitude: 25.0478,
    longitude: 121.517,
    locationNote: 'A busy evening sketch.',
  },
  sketchDate: '2026-06-10',
  tags: ['station'],
} as Artwork

const diary = {
  id: 'diary-1',
  title: 'Cafe Morning',
  content: { type: 'doc', content: [] },
  drawingJsonString: '{}',
  drawingImage: { id: 'cafe.jpg', src: 'https://example.com/cafe.jpg' },
  createdAt: 1,
  updatedAt: null,
  location: {
    country: 'Japan',
    city: 'Tokyo',
    placeName: 'Small cafe',
    latitude: 35.6762,
    longitude: 139.6503,
  },
} as DiaryType

describe('sketchMap utilities', () => {
  it('normalizes visible artworks and diaries with valid coordinates', () => {
    const items = normalizeSketchMapItems([artwork], [diary])

    expect(items).toHaveLength(2)
    expect(items[0]).toMatchObject({
      id: 'artwork-1',
      type: 'artwork',
      title: 'Taipei Station',
      detailUrl: '/artwork/artwork-1',
      latitude: 25.0478,
      longitude: 121.517,
    })
    expect(items[1]).toMatchObject({
      id: 'diary-1',
      type: 'diary',
      title: 'Cafe Morning',
      detailUrl: '/diary/diary-1',
    })
  })

  it('filters items without coordinates and items hidden from the map', () => {
    const noLocation = { ...artwork, id: 'artwork-2', location: {} } as Artwork
    const hidden = { ...diary, id: 'diary-2', isMapVisible: false } as DiaryType

    const items = normalizeSketchMapItems([artwork, noLocation], [hidden])

    expect(items).toHaveLength(1)
    expect(items[0].id).toBe('artwork-1')
  })

  it('does not immediately repeat the current item when another candidate exists', () => {
    const items = normalizeSketchMapItems([artwork], [diary])

    const nextItem = getRandomSketchMapItem(items, 'artwork-1')

    expect(nextItem?.id).toBe('diary-1')
  })
})
