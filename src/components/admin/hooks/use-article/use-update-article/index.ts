import type { CreateArtworkType } from 'types/artworks'
import { useCallback } from 'react'
import { useUpdateData } from 'utils/dataHandler'
import { DATA_BASE_NAMES } from 'constants/database'

const useUpdateArticle = () => {
  const { updateData } = useUpdateData()

  const updateArticle = useCallback(
    async (id: string, data: CreateArtworkType) => {
      await updateData(DATA_BASE_NAMES.ARTWORKS, id, data)
    },
    [updateData],
  )

  return {
    updateArticle,
  }
}

export default useUpdateArticle
