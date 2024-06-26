import type { MessageInputRef } from 'components/common/MessageInput/types'
import { useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Input } from 'components/common/ui'
import MessageInput from 'components/common/MessageInput'
import ImageUploader, { CoverImageType, DEFAULT_IMAGE_ID } from 'components/common/ImageUploader'
import useArticle from 'components/admin/hooks/use-article'
import DefaultImage from 'public/images/default.png'

const CreateArticle = () => {
  const router = useRouter()
  const { title, setTitle, coverImage, setCoverImage, createArticle } = useArticle()
  const messageInputRef = useRef<MessageInputRef | null>(null)
  const images = coverImage ? [coverImage] : [{ id: DEFAULT_IMAGE_ID, src: DefaultImage.src }]

  const onCreateArticle = useCallback(() => {
    const content = messageInputRef.current?.getContent()
    if (!content) return
    createArticle(content)
    setTitle('')
    messageInputRef.current?.clearContent()
    router.push('/admin')
  }, [createArticle, setTitle, router])

  const updateCoverImage = (images: CoverImageType[]) => {
    if (images.length === 0) return
    setCoverImage(images[0])
  }

  return (
    <div className="p-4">
      <div className="text-5 font-bold mb-4">Create Article</div>
      <div className="font-bold mb-2">Title</div>
      <Input value={title} onValueChange={setTitle} />
      <div className="font-bold my-2">Cover Image</div>
      <ImageUploader singleImage className="h-40 w-full" images={images} updateImages={updateCoverImage} />
      <div className="font-bold my-2">Content</div>
      <MessageInput ref={messageInputRef} className="h-73" />
      <Button color="secondary" onClick={onCreateArticle}>
        Create
      </Button>
      <div>
        <Link href="/admin">Back to admin</Link>
      </div>
    </div>
  )
}

export default CreateArticle
