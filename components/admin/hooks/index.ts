import { useState, useCallback } from 'react'
import type { Article } from 'components/admin/types'
import useCreateArticle from './use-create-article'

const useArticle = () => {
  const [article, setArticle] = useState<Article>({
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
