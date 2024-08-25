import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage, ref } from 'firebase/storage'
import { Analytics, getAnalytics, logEvent } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

let analytics: Analytics
if (app.name && typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}
const db = getFirestore(app)

const storage = getStorage()
const getStorageRef = (path: string) => ref(storage, path)

const auth = getAuth(app)

export { db, getStorageRef, analytics, logEvent, auth }
