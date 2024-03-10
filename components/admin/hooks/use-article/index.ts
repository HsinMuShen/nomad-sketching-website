import type { CreateArticleType } from 'components/admin/types'
import { useState, useCallback } from 'react'
import useCreateArticle from './use-create-article'
import useUpdateArticle from './use-update-article'

const useArticle = () => {
  const [article, setArticle] = useState<CreateArticleType>({
    title: '',
    content: '',
  })

  const { createArticle: createNewArticle } = useCreateArticle()
  const { updateArticle: updateArticleData } = useUpdateArticle()

  const createArticle = useCallback(() => {
    createNewArticle(article)
  }, [article, createNewArticle])

  const updateArticle = useCallback(
    (id: string) => {
      updateArticleData(id, article)
    },
    [article, updateArticleData],
  )

  return {
    article,
    setArticle,
    createArticle,
    updateArticle,
  }
}

export default useArticle
