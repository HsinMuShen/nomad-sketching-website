import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'libs/firebase'

type AuthError = {
  code: string
  message: string
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
