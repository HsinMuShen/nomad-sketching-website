import type { CreateArticleType } from 'src/components/admin/types'
import { useCallback } from 'react'
import { useCreateData } from 'src/utils/dataHandler'

const useCreateArticle = () => {
  const { createData } = useCreateData()

  const createArticle = useCallback(
    async (article: CreateArticleType) => {
      await createData({
        databaseName: 'articles',
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
