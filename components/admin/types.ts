import type { JSONContent } from '@tiptap/core'

export type CreateArticleType = {
  id?: string
  title: string
  content: JSONContent
}

export type Article = {
  id: string
  title: string
  content: JSONContent
}
