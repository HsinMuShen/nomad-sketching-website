import { useCallback } from 'react'
import { useDeleteData } from 'utils/dataHandler'

const useDeleteArticle = () => {
  const { deleteData } = useDeleteData()

  const deleteArticle = useCallback(
    async (id: string) => {
      await deleteData('articles', id)
    },
    [deleteData],
  )

  return {
    deleteArticle,
  }
}

export default useDeleteArticle
