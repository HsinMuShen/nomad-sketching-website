import type { MessageInputRef } from 'components/common/MessageInput/types'
import { useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Input } from 'components/common/ui'
import MessageInput from 'components/common/MessageInput'
import ImageUploader, { CoverImageType, DEFAULT_IMAGE_ID } from 'components/common/ImageUploader'
import SketchMetadataFields from 'components/common/SketchMetadataFields'
import { useI18n } from 'libs/i18n'
import useArticle from 'components/admin/hooks/use-article'
import DefaultImage from 'public/images/default.png'

const CreateArticle = () => {
  const router = useRouter()
  const { title, setTitle, coverImage, setCoverImage, metadata, setMetadata, createArticle } = useArticle()
  const messageInputRef = useRef<MessageInputRef | null>(null)
  const { t } = useI18n()
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
      <div className="text-5 font-bold mb-4">{t('admin.createArticleTitle')}</div>
      <div className="font-bold mb-2">{t('admin.title')}</div>
      <Input value={title} onValueChange={setTitle} />
      <div className="font-bold my-2">{t('admin.coverImage')}</div>
      <ImageUploader singleImage className="h-40 w-full" images={images} updateImages={updateCoverImage} />
      <div className="font-bold my-2">{t('admin.content')}</div>
      <MessageInput ref={messageInputRef} className="h-73" />
      <SketchMetadataFields value={metadata} onChange={setMetadata} />
      <Button color="secondary" onClick={onCreateArticle}>
        {t('common.create')}
      </Button>
      <div>
        <Link href="/admin">{t('common.backToAdmin')}</Link>
      </div>
    </div>
  )
}

export default CreateArticle
