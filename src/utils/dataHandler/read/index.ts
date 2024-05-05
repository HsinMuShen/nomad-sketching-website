import { useState, useCallback } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from 'src/libs/firebase'

const useReadData = <T>() => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const readData = useCallback(async (databaseName: string) => {
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
  }, [])

  return {
    readData,
    isLoading,
    isError,
  }
}

const useReadSingleData = <T>() => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const readSingleData = useCallback(async (databaseName: string, id: string) => {
    try {
      setIsLoading(true)
      const docRef = doc(db, databaseName, id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) return null
      return { id: docSnap.id, ...docSnap.data() } as T
    } catch (e) {
      console.error('Error reading document: ', e)
      setIsError(true)
      throw e
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    readSingleData,
    isLoading,
    isError,
  }
}

const readData = async <T>(databaseName: string): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, databaseName))
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[]
    return data
  } catch (e) {
    console.error('Error reading document:', e)
    throw e
  }
}

export { useReadData, useReadSingleData, readData }
