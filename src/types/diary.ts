import type { JSONContent } from '@tiptap/core'
import { ImageData } from 'types/image'

export type CreateDiaryType = {
  title: string
  content: JSONContent | null
  drawingJsonString: string
  drawingImage: ImageData
  createdAt: number | null
  updatedAt: number | null
}

export type DiaryType = CreateDiaryType & {
  id: string
}
