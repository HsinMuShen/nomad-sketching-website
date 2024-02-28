import type { Article } from 'components/admin/types'
import { useState, useCallback, useEffect } from 'react'
import useGetArticles from './use-get-articles'

const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([])

  const { getArticles } = useGetArticles()

  const fetchArticles = useCallback(async () => {
    const data = await getArticles()
    setArticles(data)
  }, [getArticles])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  return {
    articles,
    setArticles,
  }
}

export default useArticles
