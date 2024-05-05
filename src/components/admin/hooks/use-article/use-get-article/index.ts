import type { Article } from 'src/components/admin/types'
import { useCallback } from 'react'
import { useReadSingleData } from 'src/utils/dataHandler'

const useGetArticle = () => {
  const { readSingleData } = useReadSingleData<Article>()

  const getArticle = useCallback(
    async (id: string) => {
      const data = await readSingleData('articles', id)
      return data
    },
    [readSingleData],
  )

  return {
    getArticle,
  }
}

export default useGetArticle
