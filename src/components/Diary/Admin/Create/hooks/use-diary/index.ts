import type { CreateDiaryType } from 'types/diary'
import { useState } from 'react'
import useCreateDiary from './use-create-diary'
import { DEFAULT_DIARY } from './constants'

const useDiary = () => {
  const [diary, setDiary] = useState<CreateDiaryType>(DEFAULT_DIARY)

  const { createDiary } = useCreateDiary()

  const onCreateDiary = (createdDiary: CreateDiaryType) => {
    const { title, drawingJsonString, content } = createdDiary
    if (!title || !drawingJsonString || !content) return alert('Please fill in all fields')
    const createdAt = Date.now()

    const updatedDiary: CreateDiaryType = {
      ...createdDiary,
      createdAt,
    }

    setDiary(updatedDiary)
    createDiary(updatedDiary)
  }

  return { diary, setDiary, onCreateDiary }
}

export default useDiary
