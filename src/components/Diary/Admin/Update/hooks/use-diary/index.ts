import type { DiaryType } from 'types/diary'
import { useState, useCallback } from 'react'
import useGetDiary from './use-get-diary'
import useUpdateDiary from './use-update-diary'
import { DEFAULT_DIARY } from './constants'

const useDiary = () => {
  const [diary, setDiary] = useState<DiaryType>(DEFAULT_DIARY)

  const { getDiary } = useGetDiary()
  const { updateDiary: updateDiaryData } = useUpdateDiary()

  const fetchDiary = useCallback(
    async (id: string) => {
      const data = await getDiary(id)
      if (!data) return
      setDiary(data)
    },
    [getDiary],
  )

  const updateDiary = async () => {
    await updateDiaryData(diary.id, diary)
  }

  return { diary, setDiary, fetchDiary, updateDiary }
}

export default useDiary
