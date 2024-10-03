import type { CreateDiaryType } from 'types/diary'
import { useCallback } from 'react'
import { useCreateDataWithId } from 'utils/dataHandler'
import { DATA_BASE_NAMES } from 'constants/database'

const useCreateDiary = () => {
  const { createDataWithId } = useCreateDataWithId()

  const createDiary = useCallback(
    async (diary: CreateDiaryType) => {
      await createDataWithId({
        databaseName: DATA_BASE_NAMES.DIARY,
        data: diary,
      })
    },
    [createDataWithId],
  )

  return {
    createDiary,
  }
}

export default useCreateDiary
