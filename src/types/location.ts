export type LocationMetadata = {
  country?: string
  city?: string
  placeName?: string
  latitude?: number
  longitude?: number
  locationNote?: string
}

export type SketchMapItem = {
  id: string
  type: 'artwork' | 'diary'
  title: string
  imageUrl: string
  country?: string
  city?: string
  placeName?: string
  latitude: number
  longitude: number
  sketchDate?: string
  locationNote?: string
  tags?: string[]
  detailUrl: string
}
