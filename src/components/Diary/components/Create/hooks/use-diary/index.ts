import type { JSONContent } from '@tiptap/core'
import type { CreateDiaryType } from 'types/diary'
import useCreateDiary from './use-create-diary'
import { useState } from 'react'

const useDiary = () => {
  const [diary, setDiary] = useState<CreateDiaryType>({
    title: '',
    content: null,
    drawingJsonString: '',
  })

  const { createDiary } = useCreateDiary()

  const onCreateDiary = (newContent: JSONContent) => {
    const { title, drawingJsonString } = diary
    if (!title || !drawingJsonString) return
    if (!newContent) return

    const updatedDiary: CreateDiaryType = {
      ...diary,
      content: newContent,
    }

    setDiary(updatedDiary)
    createDiary(updatedDiary)
  }

  return { diary, setDiary, onCreateDiary }
}

export default useDiary
