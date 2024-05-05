import type { Article } from 'src/components/admin/types'
import { useCallback } from 'react'
import { useReadData } from 'src/utils/dataHandler'

const useGetArticles = () => {
  const { readData } = useReadData<Article[]>()

  const getArticles = useCallback(async () => {
    const data = await readData('articles')
    return data
  }, [readData])

  return {
    getArticles,
  }
}

export default useGetArticles
