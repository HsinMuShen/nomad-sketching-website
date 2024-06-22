import type { JSONContent } from '@tiptap/core'
import type { CreateArtworkType } from 'types/artworks'
import { CoverImageType } from 'components/common/ImageUploader'
import { useState, useCallback } from 'react'
import useCreateArticle from './use-create-article'
import useUpdateArticle from './use-update-article'
import useGetArticle from './use-get-article'

const useArticle = () => {
  const [title, setTitle] = useState<string>('')
  const [coverImage, setCoverImage] = useState<CoverImageType | null>(null)
  const [content, setContent] = useState<JSONContent | null>(null)

  const { createArticle: createNewArticle } = useCreateArticle()
  const { updateArticle: updateArticleData } = useUpdateArticle()
  const { getArticle } = useGetArticle()

  const createArticle = useCallback(
    (newContent: JSONContent) => {
      if (!title || !newContent) return
      const article: CreateArtworkType = {
        title,
        mainImage: coverImage,
        content: newContent,
      }
      createNewArticle(article)
    },
    [createNewArticle, title, coverImage],
  )

  const updateArticle = useCallback(
    (id: string, newContent: JSONContent) => {
      if (!title || !newContent) return
      const article: CreateArtworkType = {
        title,
        mainImage: coverImage,
        content: newContent,
      }
      updateArticleData(id, article)
    },
    [updateArticleData, title, coverImage],
  )

  const fetchArticle = useCallback(
    async (id: string) => {
      const data = await getArticle(id)
      if (!data) return
      const { name, content, mainImage } = data
      setTitle(name)
      setCoverImage(mainImage)
      setContent(content)
    },
    [getArticle],
  )

  return {
    title,
    setTitle,
    content,
    setContent,
    coverImage,
    setCoverImage,
    createArticle,
    updateArticle,
    fetchArticle,
  }
}

export default useArticle
