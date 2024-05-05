import { useState } from 'react'
import Image from 'next/image'
import { ImageUploadButton, IconButton } from '@ui'
import { uploadAttachment, deleteAttachment } from 'utils/attachment'
import DefaultImage from 'public/images/default.png'

type ImageUploaderProps = {
  singleImage?: boolean
  className?: string
}

type ImageFile = {
  id: string
  src: string
}

const DEFAULT_ID = 'default'

export const ImageUploader = ({ singleImage = false, className = '' }: ImageUploaderProps) => {
  const [images, setImages] = useState<ImageFile[]>([{ id: DEFAULT_ID, src: DefaultImage.src }])

  const onUpload = async (file: File) => {
    const url = await uploadAttachment(file)
    const image: ImageFile = {
      id: file.name,
      src: url,
    }
    if (!singleImage) return setImages([...images, image])
    if (images.length > 0 && images[0].id !== DEFAULT_ID) await handleDelete(images[0].id)
    setImages([image])
  }

  const handleDelete = async (imageId: string) => {
    await deleteAttachment(imageId)
    setImages(images.filter((image) => image.id !== imageId))
  }

  return (
    <div>
      <ImageUploadButton onUpload={onUpload} singleImage />
      <div className="flex flex-wrap mt-1">
        {images.map((image) => (
          <div key={image.id} className={`w-full mt-1`}>
            <div className={`relative border-1 mb-1 ${className} `}>
              <Image src={image.src} alt={image.id} fill className="object-cover" sizes="auto" />
            </div>
            {image.id !== DEFAULT_ID && (
              <IconButton
                aria-label="image-delete"
                icon="i-mdi-trash-can"
                size="xl"
                variant="plain"
                hasPadding={false}
                onClick={() => handleDelete(image.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageUploader
