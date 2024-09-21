import type { CreateDiaryType } from 'types/diary'
import { useCallback } from 'react'
import { useCreateData } from 'utils/dataHandler'
import { DATA_BASE_NAMES } from 'constants/database'

const useCreateDiary = () => {
  const { createData } = useCreateData()

  const createDiary = useCallback(
    async (diary: CreateDiaryType) => {
      await createData({
        databaseName: DATA_BASE_NAMES.DIARY,
        data: diary,
      })
    },
    [createData],
  )

  return {
    createDiary,
  }
}

export default useCreateDiary
