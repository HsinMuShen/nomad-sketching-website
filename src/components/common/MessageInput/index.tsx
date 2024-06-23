import type { JSONContent } from '@tiptap/core'
import { useState, ForwardedRef, forwardRef, useCallback, useImperativeHandle } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { ImageUploadButton, IconButton } from 'components/common/ui'
import { uploadAttachment, deleteAttachment } from 'utils/attachment'
import { generateFileWithUniqueName } from 'utils/generateFileWithUniqueName'
import { ATTACHMENT_UPLOAD_COUNT_LIMIT } from './constants'
import CustomImage from './Editor/extensions/CustomImage'
import Menu from './Menu'

type EditorProps = {
  className?: string
  placeholder?: string
  content?: JSONContent | null
}

const MessageInputWrap = (
  { className = '', placeholder = '', content }: EditorProps,
  ref: ForwardedRef<unknown>,
): JSX.Element => {
  const [attachmentCount, setAttachmentCount] = useState(0)
  const disableToUploadAttachment = attachmentCount >= ATTACHMENT_UPLOAD_COUNT_LIMIT
  const defaultContent =
    content ||
    `
    <p>
      Start typing here...
    </p>
  `

  const uploadImage = useCallback(async (file: File) => {
    const url = await uploadAttachment(file)
    return { url }
  }, [])

  const deleteImage = useCallback(async ({ name }: { name: string }) => {
    await deleteAttachment(name)
    setAttachmentCount((attachmentCount) => attachmentCount - 1)
  }, [])

  const extensions = [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
    Underline,
    CustomImage.configure({
      onUpload: uploadImage,
      onDelete: deleteImage,
    }),
  ]

  const editor = useEditor(
    {
      extensions,
      content: defaultContent,
      editorProps: {
        attributes: {
          class:
            'w-full px-2 prose dark:prose-invert !max-w-none prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none',
        },
      },
    },
    [placeholder, defaultContent],
  )

  const getContent = useCallback(() => {
    if (!editor) return
    const content = editor.getJSON()
    console.log(content)

    return content
  }, [editor])

  const clearContent = useCallback(() => {
    if (!editor) return
    if (editor.isEmpty) return
    setTimeout(() => {
      editor.commands.clearContent()
      editor.commands.focus()
    }, 0)
    setAttachmentCount(0)
  }, [editor])

  useImperativeHandle(
    ref,
    () => ({
      getContent,
      clearContent,
    }),
    [getContent, clearContent],
  )

  const insertImage = useCallback(
    (file: File) => {
      if (!editor) return

      const newFile = generateFileWithUniqueName(file)

      editor.commands.insertContent([
        {
          type: 'paragraph',
          content: [
            {
              type: 'image',
              attrs: {
                file: newFile,
                src: '',
                name: newFile.name,
              },
            },
          ],
        },
      ])

      editor.chain().focus().enter().run()

      setAttachmentCount((attachmentCount) => attachmentCount + 1)
    },
    [editor],
  )

  return (
    <>
      <Menu editor={editor} />
      <div className="flex flex-col gap-4 p-2 border-1 border-neutral-200 border-solid">
        <div className={`w-full flex overflow-y-auto ${className}`}>
          <div className={`text-sm w-full h-full`} id="editor">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="h-9 flex items-center justify-between">
          <div className="flex">
            <ImageUploadButton isDisabled={disableToUploadAttachment} onUpload={insertImage} />
            <IconButton
              icon="i-mdi-code-json"
              size="2xl"
              variant="plain"
              color="secondary"
              className="ml-2"
              hasPadding={false}
              onClick={getContent}
            />
          </div>
        </div>
      </div>
    </>
  )
}

const MessageInput = forwardRef(MessageInputWrap)
export default MessageInput
