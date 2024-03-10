import type { CreateArticleType } from 'components/admin/types'
import { useState, useCallback } from 'react'
import useCreateArticle from './use-create-article'
import useUpdateArticle from './use-update-article'
import useGetArticle from './use-get-article'

const useArticle = () => {
  const [article, setArticle] = useState<CreateArticleType>({
    title: '',
    content: '',
  })

  const { createArticle: createNewArticle } = useCreateArticle()
  const { updateArticle: updateArticleData } = useUpdateArticle()
  const { getArticle } = useGetArticle()

  const createArticle = useCallback(() => {
    createNewArticle(article)
  }, [article, createNewArticle])

  const updateArticle = useCallback(
    (id: string) => {
      updateArticleData(id, article)
    },
    [article, updateArticleData],
  )

  const fetchArticle = useCallback(
    async (id: string) => {
      const data = await getArticle(id)
      if (!data) return
      setArticle(data)
    },
    [getArticle],
  )

  return {
    article,
    setArticle,
    createArticle,
    updateArticle,
    fetchArticle,
  }
}

export default useArticle
