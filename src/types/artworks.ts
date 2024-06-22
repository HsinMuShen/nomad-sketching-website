import type { JSONContent } from '@tiptap/core'
import type { CoverImageType } from 'components/common/ImageUploader'

export type CreateArtworkType = {
  id?: string
  mainImage: CoverImageType | null
  title: string
  content: JSONContent
}

export type Artwork = {
  id: string
  mainImage: CoverImageType | null
  name: string
  content: JSONContent
}
