import type { JSONContent } from '@tiptap/core'
import type { CoverImageType } from 'components/common/ImageUploader'
import type { LocationMetadata } from './location'

export type CreateArtworkType = {
  id?: string
  mainImage: CoverImageType | null
  name: string
  content: JSONContent
  createdAt?: string
  updatedAt?: string
  location?: LocationMetadata
  sketchDate?: string
  tags?: string[]
  isFeatured?: boolean
  isMapVisible?: boolean
}

export type Artwork = {
  id: string
  mainImage: CoverImageType | null
  name: string
  content: JSONContent
  createdAt?: string
  updatedAt?: string
  location?: LocationMetadata
  sketchDate?: string
  tags?: string[]
  isFeatured?: boolean
  isMapVisible?: boolean
}
