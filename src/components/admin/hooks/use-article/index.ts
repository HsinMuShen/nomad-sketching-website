import type { JSONContent } from '@tiptap/core'
import type { CreateArticleType } from 'src/components/admin/types'
import { useState, useCallback } from 'react'
import useCreateArticle from './use-create-article'
import useUpdateArticle from './use-update-article'
import useGetArticle from './use-get-article'

const useArticle = () => {
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<JSONContent | null>(null)

  const { createArticle: createNewArticle } = useCreateArticle()
  const { updateArticle: updateArticleData } = useUpdateArticle()
  const { getArticle } = useGetArticle()

  const createArticle = useCallback(
    (newContent: JSONContent) => {
      if (!title || !newContent) return
      const article: CreateArticleType = {
        title,
        content: newContent,
      }
      createNewArticle(article)
    },
    [createNewArticle, title],
  )

  const updateArticle = useCallback(
    (id: string, newContent: JSONContent) => {
      if (!title || !newContent) return
      const article: CreateArticleType = {
        title,
        content: newContent,
      }
      updateArticleData(id, article)
    },
    [updateArticleData, title],
  )

  const fetchArticle = useCallback(
    async (id: string) => {
      const data = await getArticle(id)
      if (!data) return
      const { title, content } = data
      setTitle(title)
      setContent(content)
    },
    [getArticle],
  )

  return {
    title,
    setTitle,
    content,
    setContent,
    createArticle,
    updateArticle,
    fetchArticle,
  }
}

export default useArticle
