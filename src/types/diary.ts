import type { JSONContent } from '@tiptap/core'
import { ImageData } from 'types/image'
import type { LocationMetadata } from './location'

export type CreateDiaryType = {
  title: string
  content: JSONContent | null
  drawingJsonString: string
  drawingImage: ImageData
  createdAt: number | null
  updatedAt: number | null
  location?: LocationMetadata
  sketchDate?: string
  tags?: string[]
  isMapVisible?: boolean
}

export type DiaryType = CreateDiaryType & {
  id: string
}
