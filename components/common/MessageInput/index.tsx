import { useState, ForwardedRef, forwardRef, useCallback, useImperativeHandle } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Dropcursor from '@tiptap/extension-dropcursor'
import { ImageUploadButton, Button } from '@ui'
import { uploadAttachment } from 'utils/attachment'
import { ATTACHMENT_UPLOAD_COUNT_LIMIT } from './constants'
import CustomImage from './Editor/extensions/CustomImage'

type EditorProps = {
  className?: string
  placeholder?: string
}

const MessageInputWrap = (
  { className = '', placeholder = '' }: EditorProps,
  ref: ForwardedRef<unknown>,
): JSX.Element => {
  const [attachmentCount, setAttachmentCount] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<Map<string, string>>(new Map())
  const disableToUploadAttachment = attachmentCount >= ATTACHMENT_UPLOAD_COUNT_LIMIT

  const getFileIdentifier = (file: File) => `${file.name}-${file.lastModified}`

  const uploadImage = useCallback(
    async (file: File) => {
      const fileIdentifier = getFileIdentifier(file)
      let url = uploadedFiles.get(fileIdentifier)
      if (url !== undefined) {
        return { url }
      }
      url = await uploadAttachment(file)
      setUploadedFiles(new Map(uploadedFiles.set(fileIdentifier, url)))
      return { url }
    },
    [uploadedFiles],
  )

  const extensions = [
    StarterKit,
    Dropcursor,
    CustomImage.configure({
      onUpload: uploadImage,
    }),
  ]

  const editor = useEditor(
    {
      extensions,
      content: '<p>Hello World! 🌎️</p>',
    },
    [placeholder],
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

      editor.commands.insertContent([
        {
          type: 'paragraph',
          content: [
            {
              type: 'image',
              attrs: {
                file,
                src: '',
                name: file.name,
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
