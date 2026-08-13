import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { IconButton, SimpleTooltip } from '@ui'
import { useI18n } from 'libs/i18n'

interface ImageDisplayProps {
  imageUrl: string
  onClose: () => void
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  handleMouseUp: () => void
  isImageCover: boolean
  setIsImageCover: (value: boolean) => void
  renderBackgroundPosition: () => string
  setBackgroundPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  imageTitle: string
  id: string
}

const ImageDisplay = ({
  imageUrl,
  onClose,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  isImageCover,
  setIsImageCover,
  renderBackgroundPosition,
  setBackgroundPosition,
  imageTitle,
  id,
}: ImageDisplayProps) => {
  const router = useRouter()
  const panelRef = useRef<HTMLDivElement>(null)
  const { t } = useI18n()

  const backgroundSize = isImageCover ? 'sm:bg-cover' : 'sm:bg-contain'

  const toggleBgSize = () => {
    setBackgroundPosition({ x: 0, y: 0 })
    setIsImageCover(!isImageCover)
  }

  const navigateToArtwork = () => {
    if (!id) return
    router.push(`/artwork/${id}`)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <button
        type="button"
        aria-label={t('imageDisplay.closePreview')}
        className="fixed inset-0 z-[2990] bg-black/40"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-display-title"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        className={`image-display-panel fixed z-[3000] left-4 right-4 top-20 bottom-6 sm:left-6 sm:right-6 sm:top-24 sm:bottom-8 md:left-1/2 md:right-auto md:w-[min(92vw,920px)] md:-translate-x-1/2 md:bottom-10 md:top-24 max-w-5xl mx-auto rounded-lg border border-gray-200 bg-white shadow-xl cursor-grab bg-no-repeat bg-cover ${backgroundSize} transition-[opacity,transform] duration-200`}
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundPosition: renderBackgroundPosition(),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex ml-auto p-1">
          <SimpleTooltip message={t('common.close')} className="mr-1">
            <IconButton size="xl" icon="i-mdi-close" variant="plain" hasPadding={false} onClick={onClose} />
          </SimpleTooltip>
          <SimpleTooltip message={t('imageDisplay.toggleRatio')} className="mr-1">
            <IconButton
              size="xl"
              icon={isImageCover ? 'i-mdi-auto-fix' : 'i-mdi-selection-drag'}
              color="secondary"
              variant="plain"
              hasPadding={false}
              onClick={toggleBgSize}
            />
          </SimpleTooltip>
          <SimpleTooltip message={t('imageDisplay.viewArtwork')} className="mr-1">
            <IconButton
              size="xl"
              icon="i-mdi-book-open"
              color="secondary"
              variant="plain"
              hasPadding={false}
              disabled={!id}
              onClick={navigateToArtwork}
            />
          </SimpleTooltip>
        </div>
        <div
          id="image-display-title"
          className="absolute font-bold -top-7 left-0 max-w-50 sm:max-w-md w-full break-words pointer-events-none"
        >
          {imageTitle}
        </div>
      </div>
    </>
  )
}

export default ImageDisplay
