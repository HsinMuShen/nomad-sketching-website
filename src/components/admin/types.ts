import type { JSONContent } from '@tiptap/core'
import type { CoverImageType } from 'components/common/ImageUploader'

export type CreateArticleType = {
  id?: string
  coverImage: CoverImageType | null
  title: string
  content: JSONContent
}

export type Article = {
  id: string
  coverImage: CoverImageType | null
  title: string
  content: JSONContent
}
