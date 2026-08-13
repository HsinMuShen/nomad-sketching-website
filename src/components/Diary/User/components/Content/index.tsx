import type { JSONContent } from '@tiptap/core'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { useI18n } from 'libs/i18n'

type EditorProps = {
  className?: string
  content?: JSONContent | null
}

const Content = ({ className = '', content }: EditorProps): JSX.Element => {
  const { t } = useI18n()
  const defaultContent = content || `<p>${t('artwork.defaultContent')}</p>`

  const extensions = [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
    Underline,
  ]

  const editor = useEditor(
    {
      extensions,
      content: defaultContent,
      editable: false,
      editorProps: {
        attributes: {
          class:
            'px-2 prose dark:prose-invert !max-w-none prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none',
        },
      },
    },
    [defaultContent],
  )

  return (
    <>
      <div className="flex flex-col gap-4 px-2 py-8">
        <div className={`w-full flex overflow-y-auto ${className}`}>
          <div className={`text-sm w-full h-full`} id="editor">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Content
