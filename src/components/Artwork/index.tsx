import type { Artwork } from 'types/artworks'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import DefaultImage from 'public/images/default.png'
import { Button, Dialog } from '@ui'
import LoadingState from 'components/common/LoadingState'
import useGetArtwork from './hooks/use-get-artwork'
import Content from './components/Content'

const ArtworkComponent = () => {
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isImageDialogShowing, setIsImageDialogShowing] = useState(false)
  const { getArtwork } = useGetArtwork()
  const router = useRouter()
  const { id } = router.query

  const shouldShowArtwork = artwork && !isLoading
  const shouldShowImageDialog = artwork && isImageDialogShowing

  const showImageDialog = () => {
    setIsImageDialogShowing(true)
  }

  const closeImageDialog = () => {
    setIsImageDialogShowing(false)
  }

  const fetchArticle = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        const data = await getArtwork(id)
        console.log(data)
        if (!data) return
        setArtwork(data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [getArtwork],
  )

  useEffect(() => {
    if (typeof id !== 'string') return
    fetchArticle(id)
  }, [fetchArticle, id])

  return (
    <div className="mb-20">
      {shouldShowArtwork ? (
        <div className="my-5">
          <div className="font-bold mt-2 my-6 text-6">{artwork.name}</div>
          <div className="relative border-1 h-80 w-full cursor-pointer sm:h-100" onClick={showImageDialog}>
            <Image
              src={artwork.mainImage?.src || DefaultImage}
              alt={artwork.name}
              fill
              priority
              className="object-contain bg-white"
              sizes="auto"
            />
          </div>
          <Content content={artwork.content} />
        </div>
      ) : (
        <LoadingState />
      )}
      <Button variant="plain" color="secondary" onClick={() => router.push('/artworks')}>
        Back to artworks
      </Button>
      {shouldShowImageDialog && (
        <Dialog title={artwork.name} size="md" onClose={closeImageDialog}>
          <div className="relative h-full w-full">
            <Image
              src={artwork.mainImage?.src || DefaultImage}
              alt={artwork.name}
              fill
              priority
              className="object-contain"
              sizes="auto"
            />
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default ArtworkComponent
