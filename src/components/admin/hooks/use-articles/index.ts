import type { Article } from 'src/components/admin/types'
import { useState, useCallback } from 'react'
import useGetArticles from './use-get-articles'
import useDeleteArticle from './use-delete-article'

const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([])

  const { getArticles } = useGetArticles()
  const { deleteArticle } = useDeleteArticle()

  const fetchArticles = useCallback(async () => {
    const data = await getArticles()
    setArticles(data)
  }, [getArticles])

  const removeArticle = useCallback(
    async (id: string) => {
      await deleteArticle(id)
      const filteredArticles = articles.filter((article) => article.id !== id)
      setArticles(filteredArticles)
    },
    [deleteArticle, articles],
  )

  return {
    articles,
    setArticles,
    fetchArticles,
    removeArticle,
  }
}

export default useArticles
