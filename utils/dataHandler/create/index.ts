import { useState } from 'react'
import {
  collection,
  addDoc,
  DocumentData,
  WithFieldValue,
} from 'firebase/firestore'
import { db } from 'libs/firebase'

const useCreateData = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const createData = async <T extends WithFieldValue<DocumentData>>({
    databaseName,
    data,
  }: {
    databaseName: string
    data: T
  }) => {
    try {
      setIsLoading(true)
      console.log('Creating user...')
      const docRef = await addDoc(collection(db, databaseName), data)
      console.log('Document written with ID: ', docRef.id)
      setIsSuccess(true)
    } catch (e) {
      console.error('Error adding document: ', e)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createData,
    isLoading,
    isSuccess,
    isError,
  }
}

export default useCreateData
