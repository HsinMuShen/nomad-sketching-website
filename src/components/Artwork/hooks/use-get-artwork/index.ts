import type { Artwork } from 'types/artworks'
import { useCallback } from 'react'
import { useReadSingleData } from 'src/utils/dataHandler'

const useGetArtwork = () => {
  const { readSingleData } = useReadSingleData<Artwork>()

  const getArtwork = useCallback(
    async (id: string) => {
      const data = await readSingleData('artworks', id)
      return data
    },
    [readSingleData],
  )

  return {
    getArtwork,
  }
}

export default useGetArtwork
