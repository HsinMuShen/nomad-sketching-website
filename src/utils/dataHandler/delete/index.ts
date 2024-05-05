import { useState, useCallback } from 'react'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from 'src/libs/firebase'

const useDeleteData = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const deleteData = useCallback(async (databaseName: string, id: string) => {
    try {
      setIsLoading(true)
      await deleteDoc(doc(db, databaseName, id))
    } catch (e) {
      console.error('Error deleting document: ', e)
      setIsError(true)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    deleteData,
    isLoading,
    isError,
  }
}

export default useDeleteData
