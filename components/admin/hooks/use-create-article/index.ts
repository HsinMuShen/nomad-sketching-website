import { useCallback } from 'react'
import { useCreateData } from 'utils/dataHandler'
import type { Article } from 'components/admin/types'

const useCreateArticle = () => {
  const createArticle = useCallback(async (article: Article) => {
    const { createData } = useCreateData()
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
