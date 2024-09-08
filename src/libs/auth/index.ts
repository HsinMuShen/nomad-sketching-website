import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from 'libs/firebase'
import type { User } from 'types/user'

type AuthError = {
  code: string
  message: string
}

export const checkIsAlreadyLogin = (setUser: (user: User) => void) => {
  onAuthStateChanged(auth, (user) => {
    if (!user) return
    const { email, uid } = user
    if (!email || !uid) return

    setUser({ email, uid })
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
