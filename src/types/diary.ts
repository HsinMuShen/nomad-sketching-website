import type { JSONContent } from '@tiptap/core'

export type CreateDiaryType = {
  title: string
  content: JSONContent | null
  drawingJsonString: string
}
