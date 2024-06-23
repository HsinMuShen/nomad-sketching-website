import type { Artwork } from 'types/artworks'
import { useCallback } from 'react'
import { useReadData } from 'utils/dataHandler'
import { DATA_BASE_NAMES } from 'constants/database'

const useGetArticles = () => {
  const { readData } = useReadData<Artwork[]>()

  const getArticles = useCallback(async () => {
    const data = await readData(DATA_BASE_NAMES.ARTWORKS)
    return data
  }, [readData])

  return {
    getArticles,
  }
}

export default useGetArticles
