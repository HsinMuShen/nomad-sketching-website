import type { Artwork } from 'types/artworks'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import DefaultImage from 'public/images/default.png'
import { Button, Dialog } from 'components/common/ui'
import useGetArtwork from './hooks/use-get-artwork'
import Content from './components/Content'

const ArtworkComponent = () => {
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [isImageDialogShowing, setIsImageDialogShowing] = useState(false)
  const { getArtwork } = useGetArtwork()
  const router = useRouter()
  const { id } = router.query

  const shouldShowImageDialog = artwork && isImageDialogShowing

  const showImageDialog = () => {
    setIsImageDialogShowing(true)
  }

  const closeImageDialog = () => {
    setIsImageDialogShowing(false)
  }

  const fetchArticle = useCallback(
    async (id: string) => {
      const data = await getArtwork(id)
      console.log(data)
      if (!data) return
      setArtwork(data)
    },
    [getArtwork],
  )

  useEffect(() => {
    if (typeof id !== 'string') return
    fetchArticle(id)
  }, [fetchArticle, id])

  return (
    <div className="mb-20">
      {artwork && (
        <div className="my-5">
          <div className="font-bold mt-2 my-6 text-6">{artwork.name}</div>
          <div className="relative border-1 h-80 w-full cursor-pointer" onClick={showImageDialog}>
            <Image
              src={artwork.mainImage?.src || DefaultImage}
              alt={artwork.name}
              fill
              priority
              className="object-cover"
              sizes="auto"
            />
          </div>
          <Content content={artwork.content} />
        </div>
      )}
      <Button variant="plain" color="secondary" onClick={() => router.push('/artworks')}>
        Back to artworks
      </Button>
      {shouldShowImageDialog && (
        <Dialog title={artwork.name} size="lg" onClose={closeImageDialog}>
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
