import { useRef } from 'react'
import { IconButton } from '@ui'
import { IMAGE_ACCEPTABLE_TYPES } from './constants'

export type ImageUploadButtonProps = {
  isDisabled?: boolean
  onUpload: (file: File) => void
} & React.HTMLAttributes<HTMLDivElement>

export const ImageUploadButton = ({
  isDisabled = false,
  onUpload,
}: ImageUploadButtonProps) => {
  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    const filesArray = Array.from(files)
    filesArray.forEach((file) => onUpload(file))

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
        variant="plain-text"
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
