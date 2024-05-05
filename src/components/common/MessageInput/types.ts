import type { JSONContent } from '@tiptap/core'

export type MessageInputRef = {
  getContent: () => JSONContent | null
  clearContent: () => void
}
