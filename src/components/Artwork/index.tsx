import type { Artwork } from 'types/artworks'
import type { MessageInputRef } from 'components/common/MessageInput/types'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Input } from 'components/common/ui'
import MessageInput from 'components/common/MessageInput'
import useGetArtwork from './hooks/use-get-artwork'

const ArtworkComponent = () => {
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const messageInputRef = useRef<MessageInputRef | null>(null)
  const { getArtwork } = useGetArtwork()
  const router = useRouter()
  const { id } = router.query

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
    <div className="p-4">
      {artwork && (
        <div>
          <Input value={artwork.name} />
          <div className="font-bold my-2">Content</div>
          <MessageInput ref={messageInputRef} content={artwork.content} />
        </div>
      )}
    </div>
  )
}

export default ArtworkComponent
