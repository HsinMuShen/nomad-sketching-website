import type { Artwork } from 'types/artworks'
import { useCallback } from 'react'
import { useReadSingleData } from 'utils/dataHandler'
import { DATA_BASE_NAMES } from 'constants/database'

const useGetArticle = () => {
  const { readSingleData } = useReadSingleData<Artwork>()

  const getArticle = useCallback(
    async (id: string) => {
      const data = await readSingleData(DATA_BASE_NAMES.ARTWORKS, id)
      return data
    },
    [readSingleData],
  )

  return {
    getArticle,
  }
}

export default useGetArticle
