import { useRef } from 'react'
import { IconButton } from 'src/components/common/ui'
import { IMAGE_ACCEPTABLE_TYPES } from './constants'

export type ImageUploadButtonProps = {
  isDisabled?: boolean
  singleImage?: boolean
  onUpload: (file: File) => void
} & React.HTMLAttributes<HTMLDivElement>

export const ImageUploadButton = ({ isDisabled = false, singleImage = false, onUpload }: ImageUploadButtonProps) => {
  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    const filesArray = Array.from(files)
    if (singleImage) onUpload(filesArray[0])
    if (!singleImage) filesArray.forEach((file) => onUpload(file))
    event.target.value = ''
  }

  const inputRef = useRef<HTMLInputElement>(null)
  const onButtonClick = () => inputRef.current?.click()

  return (
    <div>
      <IconButton
        aria-label="image-upload"
        icon="i-mdi-image-area"
        size="2xl"
        variant="plain"
        color="secondary"
        hasPadding={false}
        onClick={onButtonClick}
        disabled={isDisabled}
      />
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept={IMAGE_ACCEPTABLE_TYPES}
        multiple
        onInput={onInput}
        placeholder="upload image"
      />
    </div>
  )
}

export default ImageUploadButton
