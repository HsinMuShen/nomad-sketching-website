import { useState, useCallback } from 'react'
import { collection, setDoc, doc, DocumentData, WithFieldValue } from 'firebase/firestore'
import { db } from 'libs/firebase'

const useCreateDataWithId = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const createDataWithId = useCallback(
    async <T extends WithFieldValue<DocumentData>>({ databaseName, data }: { databaseName: string; data: T }) => {
      try {
        setIsLoading(true)
        const docId = Date.now().toString()
        await setDoc(doc(collection(db, databaseName), docId), data)
        console.log('Document written with ID: ', docId)
        setIsSuccess(true)
      } catch (e) {
        console.error('Error adding document: ', e)
        setIsError(true)
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return {
    createDataWithId,
    isLoading,
    isSuccess,
    isError,
  }
}

export default useCreateDataWithId
