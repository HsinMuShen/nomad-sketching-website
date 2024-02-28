import { useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from 'libs/firebase'

const useReadData = <T>() => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const readData = async (databaseName: string) => {
    try {
      setIsLoading(true)
      const querySnapshot = await getDocs(collection(db, databaseName))
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T
      return data
    } catch (e) {
      console.error('Error reading document: ', e)
      setIsError(true)
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  return {
    readData,
    isLoading,
    isError,
  }
}

export default useReadData
