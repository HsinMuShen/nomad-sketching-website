import type { MessageInputRef } from 'components/common/MessageInput/types'
import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import { Input, Button } from 'components/common/ui'
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
    alert('Article updated successfully')
    router.push('/admin')
  }, [updateArticle, id, router])

  const updateCoverImage = (images: CoverImageType[]) => {
    if (images.length === 0) return
    setCoverImage(images[0])
  }

  useEffect(() => {
    if (typeof id !== 'string') return
    fetchArticle(id)
  }, [fetchArticle, id])

  return (
    <div className="p-4 mb-10">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-6 font-bold mb-4">Update Article</h1>
        <Button variant="plain" color="secondary" onClick={onUpdateArticle}>
          Update
        </Button>
      </div>
      <div className="py-3">
        <div className="text-4 font-bold mb-2">Title</div>
        <Input value={title} onValueChange={setTitle} />
      </div>
      <div className="py-3">
        <div className="text-4 font-bold my-2">Cover Image</div>
        <ImageUploader singleImage className="h-40 w-full" images={images} updateImages={updateCoverImage} />
      </div>
      <div className="py-3">
        <div className="text-4 font-bold my-2">Content</div>
        <MessageInput ref={messageInputRef} content={content} />
      </div>
      <Button variant="plain" color="secondary" onClick={() => router.push('/admin')}>
        Back to admin
      </Button>
    </div>
  )
}

export default Update
