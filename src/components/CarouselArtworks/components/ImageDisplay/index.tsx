import { useRouter } from 'next/router'
import { IconButton } from '@ui'

interface ImageDisplayProps {
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  handleMouseUp: () => void
  isImageCover: boolean
  setIsImageCover: (value: boolean) => void
  renderBackgroundPosition: () => string
  setBackgroundPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  imgRef: React.RefObject<HTMLDivElement>
  imageTitle: string
  id: string
}

const ImageDisplay = ({
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  isImageCover,
  setIsImageCover,
  renderBackgroundPosition,
  setBackgroundPosition,
  imgRef,
  imageTitle,
  id,
}: ImageDisplayProps) => {
  const router = useRouter()

  const backgroundSize = isImageCover ? 'sm:bg-cover' : 'sm:bg-contain'
  const toggleBgSize = () => {
    setBackgroundPosition({ x: 0, y: 0 })
    setIsImageCover(!isImageCover)
  }
  const navigateToArtwork = () => {
    router.push(`/artwork/${id}`)
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      className={`image-display relative bg-white w-80vw h-60vh fixed cursor-grab top-10 border border-white rounded bg-no-repeat bg-cover ${backgroundSize}`}
      ref={imgRef}
      style={{ backgroundPosition: renderBackgroundPosition() }}
    >
      <div className="flex ml-auto">
        <div className="relative group mr-1">
          <IconButton
            size="xl"
            icon="i-mdi-close"
            variant="plain"
            hasPadding={false}
            onClick={() => (imgRef.current!.style.transform = 'scale(0.0, 0.0)')}
          />
          <div className="z-3 absolute whitespace-nowrap top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
            Close image
          </div>
        </div>
        <div className="relative group mr-1">
          <IconButton
            size="xl"
            icon={isImageCover ? 'i-mdi-auto-fix' : 'i-mdi-selection-drag'}
            color="secondary"
            variant="plain"
            hasPadding={false}
            onClick={toggleBgSize}
          />
          <div className="z-3 absolute whitespace-nowrap top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
            Change background size
          </div>
        </div>
        <div className="relative group mr-1">
          <IconButton
            size="xl"
            icon="i-mdi-book-open"
            color="secondary"
            variant="plain"
            hasPadding={false}
            onClick={navigateToArtwork}
          />
          <div className="z-3 absolute whitespace-nowrap top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
            View artwork details
          </div>
        </div>
      </div>
      <div className="absolute font-bold -top-7 max-w-50 sm:max-w-md w-full break-words">{imageTitle}</div>
    </div>
  )
}

export default ImageDisplay
