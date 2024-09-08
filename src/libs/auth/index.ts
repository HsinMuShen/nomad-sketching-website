import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from 'libs/firebase'
import type { User } from 'types/user'

type AuthError = {
  code: string
  message: string
}

export const checkIsAlreadyLogin = (
  setUser: (user: User) => void,
  setHasInitialized: (hasInitialized: boolean) => void,
) => {
  onAuthStateChanged(auth, (user) => {
    if (!user) return setHasInitialized(true)

    const { email, uid } = user
    if (!email || !uid) return setHasInitialized(true)

    setUser({ email, uid })
    setHasInitialized(true)
  })
}

export const signUp = async (inputEmail: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, inputEmail, password)
    const { email, uid } = userCredential.user
    if (!email || !uid) throw new Error('Failed to create user')
    return { email, uid }
  } catch (error) {
    throw new Error((error as AuthError).message)
  }
}

export const signIn = async (inputEmail: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, inputEmail, password)
    const { email, uid } = userCredential.user
    if (!email || !uid) throw new Error('Failed to create user')
    return { email, uid }
  } catch (error) {
    throw new Error((error as AuthError).message)
  }
}
