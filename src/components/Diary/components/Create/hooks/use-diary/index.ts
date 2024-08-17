import type { JSONContent } from '@tiptap/core'
import type { CreateDiaryType } from 'types/diary'
import { ImageData } from 'types/image'
import useCreateDiary from './use-create-diary'
import { useState } from 'react'

const useDiary = () => {
  const [diary, setDiary] = useState<CreateDiaryType>({
    title: '',
    content: null,
    drawingJsonString: '',
    drawingImage: {
      id: '',
      src: '',
    },
  })

  const { createDiary } = useCreateDiary()

  const onCreateDiary = (content: JSONContent, drawingImage: ImageData) => {
    const { title, drawingJsonString } = diary
    if (!title || !drawingJsonString) return
    if (!content) return

    const updatedDiary: CreateDiaryType = {
      ...diary,
      content,
      drawingImage,
    }

    setDiary(updatedDiary)
    createDiary(updatedDiary)
  }

  return { diary, setDiary, onCreateDiary }
}

export default useDiary
