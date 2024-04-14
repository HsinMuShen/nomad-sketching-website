import type { JSONContent } from '@tiptap/core'
import { useState, ForwardedRef, forwardRef, useCallback, useImperativeHandle } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ImageUploadButton, Button } from '@ui'
import { uploadAttachment, deleteAttachment } from 'utils/attachment'
import { ATTACHMENT_UPLOAD_COUNT_LIMIT } from './constants'
import CustomImage from './Editor/extensions/CustomImage'

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
  const defaultContent = content || '<p>Hello World! 🌎️</p>'

  const uploadImage = useCallback(async (file: File) => {
    const url = await uploadAttachment(file)
    return { url }
  }, [])

  const deleteImage = useCallback(async ({ name }: { name: string }) => {
    await deleteAttachment(name)
    setAttachmentCount((attachmentCount) => attachmentCount - 1)
  }, [])

  const extensions = [
    StarterKit,
    CustomImage.configure({
      onUpload: uploadImage,
      onDelete: deleteImage,
    }),
  ]

  const editor = useEditor(
    {
      extensions,
      content: defaultContent,
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

  const generateFileWithUniqueName = (file: File) => {
    const uniqueName = file.name + '_' + Date.now()
    return new File([file], uniqueName, {
      type: file.type,
      lastModified: file.lastModified,
    })
  }

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
    <div className="flex flex-col gap-4">
      <div className={`flex overflow-scroll ${className}`}>
        <div className={'text-sm'}>
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="h-9 flex items-center justify-between">
        <div className="flex">
          <ImageUploadButton isDisabled={disableToUploadAttachment} onUpload={insertImage} />
          <Button className="ml-2" onClick={getContent}>
            getJSON
          </Button>
        </div>
      </div>
    </div>
  )
}

const MessageInput = forwardRef(MessageInputWrap)
export default MessageInput
