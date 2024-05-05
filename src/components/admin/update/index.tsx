import type { MessageInputRef } from 'components/common/MessageInput/types'
import { useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Input } from 'components/common/ui'
import ImageUploader, { CoverImageType, DEFAULT_IMAGE_ID } from 'components/common/ImageUploader'
import useArticle from 'components/admin/hooks/use-article'
import MessageInput from 'components/common/MessageInput'
import DefaultImage from 'public/images/default.png'

const Update = () => {
  const messageInputRef = useRef<MessageInputRef | null>(null)
  const router = useRouter()
  const { id } = router.query
  const { title, setTitle, coverImage, setCoverImage, content, fetchArticle, updateArticle } = useArticle()

  const images = coverImage ? [coverImage] : [{ id: DEFAULT_IMAGE_ID, src: DefaultImage.src }]

  const onUpdateArticle = useCallback(() => {
    const content = messageInputRef.current?.getContent()
    if (!content) return
    if (typeof id !== 'string') return
    updateArticle(id, content)
  }, [updateArticle, id])

  const updateCoverImage = (images: CoverImageType[]) => {
    if (images.length === 0) return
    setCoverImage(images[0])
  }

  useEffect(() => {
    if (typeof id !== 'string') return
    fetchArticle(id)
  }, [fetchArticle, id])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Article</h1>
      <div className="font-bold mb-2">Title</div>
      <Input value={title} onValueChange={setTitle} />
      <div className="font-bold my-2">Cover Image</div>
      <ImageUploader singleImage className="h-40 w-full" images={images} updateImages={updateCoverImage} />
      <div className="font-bold my-2">Content</div>
      <MessageInput ref={messageInputRef} content={content} />
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={onUpdateArticle}>
        Update
      </button>
      <div>
        <Link href="/admin">Back to admin</Link>
      </div>
    </div>
  )
}

export default Update
