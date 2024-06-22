import { useCallback } from 'react'
import { useDeleteData } from 'utils/dataHandler'
import { DATA_BASE_NAMES } from 'constants/database'

const useDeleteArticle = () => {
  const { deleteData } = useDeleteData()

  const deleteArticle = useCallback(
    async (id: string) => {
      await deleteData(DATA_BASE_NAMES.ARTWORKS, id)
    },
    [deleteData],
  )

  return {
    deleteArticle,
  }
}

export default useDeleteArticle
