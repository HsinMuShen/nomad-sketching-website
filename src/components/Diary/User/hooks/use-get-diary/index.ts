import type { DiaryType } from 'types/diary'
import { useCallback } from 'react'
import { useReadSingleData } from 'utils/dataHandler'
import { DATA_BASE_NAMES } from 'constants/database'

const useGetDiary = () => {
  const { readSingleData } = useReadSingleData<DiaryType>()

  const getDiary = useCallback(
    async (id: string) => {
      const data = await readSingleData(DATA_BASE_NAMES.DIARY, id)
      return data
    },
    [readSingleData],
  )

  return {
    getDiary,
  }
}

export default useGetDiary
