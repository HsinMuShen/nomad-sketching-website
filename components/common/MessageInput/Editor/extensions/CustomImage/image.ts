import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import View from './components/View'

const NAME = 'image'

export interface ImageOptions {
  inline: boolean
  allowBase64: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>
  onDelete: ((payload: { url: string; sourceAbleToDelete?: boolean }) => Promise<void>) | null
  onUpload: ((file: File) => Promise<{ url: string }>) | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setFile: (options: { file: File; src?: string; name?: string }) => ReturnType
    }
  }
}

export const Image = Node.create<ImageOptions>({
  name: NAME,

  addOptions() {
    return {
      inline: true,
      allowBase64: false,
      HTMLAttributes: {},
      onUpload: null,
      onDelete: null,
    }
  },

  inline() {
    return this.options.inline
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: '',
      },
      name: {
        default: '',
      },
      file: {
        default: null,
        rendered: false,
      },
      sourceAbleToDelete: {
        default: true,
        rendered: false,
      },
    }
  },

  addCommands() {
    return {
      setFile:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: NAME,
            attrs: options,
          })
        },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(View)
  },
})
