import type { ImageData } from 'types/image'
import { useState } from 'react'
import type { JSONContent } from '@tiptap/core'
import type { CreateDiaryType } from 'types/diary'
import useCreateDiary from './use-create-diary'
import { DEFAULT_DIARY } from './constants'

const useDiary = () => {
  const [diary, setDiary] = useState<CreateDiaryType>(DEFAULT_DIARY)

  const { createDiary } = useCreateDiary()

  const onCreateDiary = (content: JSONContent, drawingImage: ImageData) => {
    const { title, drawingJsonString } = diary
    if (!title || !drawingJsonString) return
    if (!content) return
    const createdAt = Date.now()

    const updatedDiary: CreateDiaryType = {
      ...diary,
      content,
      drawingImage,
      createdAt,
    }

    setDiary(updatedDiary)
    createDiary(updatedDiary)
  }

  return { diary, setDiary, onCreateDiary }
}

export default useDiary
