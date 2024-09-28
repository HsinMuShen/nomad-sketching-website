import type { CreateDiaryType } from 'types/diary'
import { useCallback } from 'react'
import { useUpdateData } from 'utils/dataHandler'
import { DATA_BASE_NAMES } from 'constants/database'

const useUpdateDiary = () => {
  const { updateData } = useUpdateData()

  const updateDiary = useCallback(
    async (id: string, data: CreateDiaryType) => {
      await updateData(DATA_BASE_NAMES.DIARY, id, data)
    },
    [updateData],
  )

  return {
    updateDiary,
  }
}

export default useUpdateDiary
