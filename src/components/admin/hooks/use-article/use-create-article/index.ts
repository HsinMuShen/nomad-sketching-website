import type { CreateArtworkType } from 'types/artworks'
import { useCallback } from 'react'
import { useCreateData } from 'utils/dataHandler'
import { DATA_BASE_NAMES } from 'constants/database'

const useCreateArticle = () => {
  const { createData } = useCreateData()

  const createArticle = useCallback(
    async (article: CreateArtworkType) => {
      await createData({
        databaseName: DATA_BASE_NAMES.ARTWORKS,
        data: article,
      })
    },
    [createData],
  )

  return {
    createArticle,
  }
}

export default useCreateArticle
