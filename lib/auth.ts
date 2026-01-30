import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return { success: true, user: result.user }
  } catch (error) {
    console.error('Google sign in error:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: result.user }
  } catch (error) {
    console.error('Email sign in error:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { success: true, user: result.user }
  } catch (error) {
    console.error('Sign up error:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function signOutUser() {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    return { success: false, error: (error as Error).message }
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser
}