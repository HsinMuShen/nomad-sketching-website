import type { CreateArticleType } from 'src/components/admin/types'
import { useCallback } from 'react'
import { useUpdateData } from 'src/utils/dataHandler'

const useUpdateArticle = () => {
  const { updateData } = useUpdateData()

  const updateArticle = useCallback(
    async (id: string, data: CreateArticleType) => {
      await updateData('articles', id, data)
    },
    [updateData],
  )

  return {
    updateArticle,
  }
}

export default useUpdateArticle
