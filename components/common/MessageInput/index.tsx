import type { JSONContent } from '@tiptap/core'
import { useState, ForwardedRef, forwardRef, useCallback, useImperativeHandle } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Code from '@tiptap/extension-code'
import { ImageUploadButton, Button } from '@ui'
import { uploadAttachment, deleteAttachment } from 'utils/attachment'
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
    <h2>
      Hi there,
    </h2>
    <p><code>This is code.</code></p>
    <p>
      this is a basic <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
    </p>
    <ul>
      <li>
        That’s a bullet list with one …
      </li>
      <li>
        … or two list items.
      </li>
    </ul>
    <p>
      Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
    </p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
    <p>
      I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
    </p>
    <blockquote>
      Wow, that’s amazing. Good work, boy! 👏
      <br />
      — Mom
    </blockquote>
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
    StarterKit,
    Heading.configure({
      levels: [1, 2, 3],
    }),
    Document,
    Paragraph,
    Text,
    Underline,
    Code,
    BulletList,
    OrderedList,
    ListItem,
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
          class: 'mx-2 prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none',
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
            <Button className="ml-2" onClick={getContent}>
              getJSON
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

const MessageInput = forwardRef(MessageInputWrap)
export default MessageInput
