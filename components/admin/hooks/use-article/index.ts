import type { CreateArticleType } from 'components/admin/types'
import { useState, useCallback } from 'react'
import useCreateArticle from './use-create-article'

const useArticle = () => {
  const [article, setArticle] = useState<CreateArticleType>({
    title: '',
    content: '',
  })

  const { createArticle: createNewArticle } = useCreateArticle()

  const createArticle = useCallback(() => {
    createNewArticle(article)
  }, [article, createNewArticle])

  return {
    article,
    setArticle,
    createArticle,
  }
}

export default useArticle
