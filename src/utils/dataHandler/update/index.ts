import { useState, useCallback } from 'react'
import { doc, updateDoc, DocumentData, WithFieldValue } from 'firebase/firestore'
import { db } from 'src/libs/firebase'

const useUpdateData = <T extends WithFieldValue<DocumentData>>() => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const updateData = useCallback(async (databaseName: string, id: string, data: T) => {
    try {
      setIsLoading(true)
      await updateDoc(doc(db, databaseName, id), data)
      setIsSuccess(true)
    } catch (e) {
      console.error('Error updating document: ', e)
      setIsError(true)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    updateData,
    isLoading,
    isSuccess,
    isError,
  }
}

export default useUpdateData
