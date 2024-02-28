import type { CreateArticleType } from 'components/admin/types'
import { useCallback } from 'react'
import { useCreateData } from 'utils/dataHandler'

const useCreateArticle = () => {
  const { createData } = useCreateData()

  const createArticle = useCallback(async (article: CreateArticleType) => {
    await createData({
      databaseName: 'articles',
      data: article,
    })
  }, [])

  return {
    createArticle,
  }
}

export default useCreateArticle
