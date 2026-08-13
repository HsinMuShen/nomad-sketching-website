import type { JSONContent } from '@tiptap/core'
import type { CreateArtworkType } from 'types/artworks'
import type { SketchMetadataValue } from 'components/common/SketchMetadataFields'
import { CoverImageType } from 'components/common/ImageUploader'
import { useState, useCallback } from 'react'
import useCreateArticle from './use-create-article'
import useUpdateArticle from './use-update-article'
import useGetArticle from './use-get-article'

const useArticle = () => {
  const [artwork, setArtwork] = useState<CreateArtworkType | null>(null)
  const [title, setTitle] = useState<string>('')
  const [coverImage, setCoverImage] = useState<CoverImageType | null>(null)
  const [content, setContent] = useState<JSONContent | null>(null)
  const [metadata, setMetadata] = useState<SketchMetadataValue>({
    isMapVisible: true,
  })

  const { createArticle: createNewArticle } = useCreateArticle()
  const { updateArticle: updateArticleData } = useUpdateArticle()
  const { getArticle } = useGetArticle()

  const createArticle = useCallback(
    (newContent: JSONContent) => {
      if (!title || !newContent) return
      const article: CreateArtworkType = {
        ...artwork,
        name: title,
        mainImage: coverImage,
        content: newContent,
        createdAt: new Date().toISOString(),
        location: metadata.location,
        sketchDate: metadata.sketchDate,
        tags: metadata.tags,
        isMapVisible: metadata.isMapVisible ?? true,
      }
      createNewArticle(article)
    },
    [createNewArticle, title, coverImage, artwork, metadata],
  )

  const updateArticle = useCallback(
    (id: string, newContent: JSONContent) => {
      if (!title || !newContent) return
      const article: CreateArtworkType = {
        ...artwork,
        name: title,
        mainImage: coverImage,
        content: newContent,
        updatedAt: new Date().toISOString(),
        location: metadata.location,
        sketchDate: metadata.sketchDate,
        tags: metadata.tags,
        isMapVisible: metadata.isMapVisible ?? true,
      }
      updateArticleData(id, article)
    },
    [updateArticleData, title, coverImage, artwork, metadata],
  )

  const fetchArticle = useCallback(
    async (id: string) => {
      const data = await getArticle(id)
      if (!data) return
      const { name, content, mainImage, location, sketchDate, tags, isMapVisible } = data
      setTitle(name)
      setCoverImage(mainImage)
      setContent(content)
      setMetadata({ location, sketchDate, tags, isMapVisible })
      setArtwork(data)
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
    metadata,
    setMetadata,
    createArticle,
    updateArticle,
    fetchArticle,
  }
}

export default useArticle
