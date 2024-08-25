import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from 'libs/firebase'

type AuthError = {
  code: string
  message: string
}

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw new Error((error as AuthError).message)
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw new Error((error as AuthError).message)
  }
}
