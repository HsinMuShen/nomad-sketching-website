import { useCallback } from 'react'
import { useDeleteData } from 'utils/dataHandler'
import { DATA_BASE_NAMES } from 'constants/database'

const useDeleteDiary = () => {
  const { deleteData } = useDeleteData()

  const deleteDiary = useCallback(
    async (id: string) => {
      await deleteData(DATA_BASE_NAMES.DIARY, id)
    },
    [deleteData],
  )

  return {
    deleteDiary,
  }
}

export default useDeleteDiary
