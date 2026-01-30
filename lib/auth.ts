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

// Flag para usar autenticação mockada temporariamente
const USE_MOCK_AUTH = false

// Usuário mockado para testes
const MOCK_USER = {
  uid: 'mock-user-123',
  displayName: 'Usuário Teste',
  email: 'teste@cdforge.shop',
  photoURL: null
}

export async function signInWithGoogle() {
  if (USE_MOCK_AUTH) {
    // Autenticação mockada para testes
    console.log('Mock Google login successful');
    return { success: true, user: MOCK_USER }
  }
  
  try {
    console.log('Attempting Google popup login...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google login successful:', result.user);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Google sign in error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function signInWithEmail(email: string, password: string) {
  if (USE_MOCK_AUTH) {
    // Autenticação mockada para testes
    if (email && password) {
      return { success: true, user: { ...MOCK_USER, email } }
    }
    return { success: false, error: 'Credenciais inválidas' }
  }
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: result.user }
  } catch (error) {
    console.error('Email sign in error:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function signUpWithEmail(email: string, password: string) {
  if (USE_MOCK_AUTH) {
    // Autenticação mockada para testes
    if (email && password) {
      return { success: true, user: { ...MOCK_USER, email } }
    }
    return { success: false, error: 'Dados inválidos' }
  }
  
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { success: true, user: result.user }
  } catch (error) {
    console.error('Sign up error:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function signOutUser() {
  if (USE_MOCK_AUTH) {
    return { success: true }
  }
  
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    return { success: false, error: (error as Error).message }
  }
}

export function getCurrentUser(): User | null {
  if (USE_MOCK_AUTH) {
    return MOCK_USER as User
  }
  return auth.currentUser
}