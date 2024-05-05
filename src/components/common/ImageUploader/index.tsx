import { useState } from 'react'
import Image from 'next/image'
import { ImageUploadButton, IconButton } from 'src/components/common/ui'
import { uploadAttachment, deleteAttachment } from 'src/utils/attachment'
import DefaultImage from 'public/images/default.png'

type ImageUploaderProps = {
  images: CoverImageType[]
  updateImages: (images: CoverImageType[]) => void
  singleImage?: boolean
  className?: string
}

export type CoverImageType = {
  id: string
  src: string
}

export const DEFAULT_IMAGE_ID = 'default'

export const ImageUploader = ({images, updateImages, singleImage = false, className = '' }: ImageUploaderProps) => {

  const onUpload = async (file: File) => {
    const url = await uploadAttachment(file)
    const image: CoverImageType = {
      id: file.name,
      src: url,
    }
    if (!singleImage) return updateImages([...images, image])
    if (images.length > 0 && images[0].id !== DEFAULT_IMAGE_ID) await handleDelete(images[0].id)
    updateImages([image])
  }

  const handleDelete = async (imageId: string) => {
    await deleteAttachment(imageId)
    updateImages(images.filter((image) => image.id !== imageId))
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
            {image.id !== DEFAULT_IMAGE_ID && (
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
