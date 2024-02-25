import {
  collection,
  addDoc,
  DocumentData,
  WithFieldValue,
} from 'firebase/firestore'
import { db } from 'libs/firebase'

export async function createDate<T extends WithFieldValue<DocumentData>>({
  databaseName,
  data,
}: {
  databaseName: string
  data: T
}) {
  try {
    console.log('Creating user...')
    const docRef = await addDoc(collection(db, databaseName), data)
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}
