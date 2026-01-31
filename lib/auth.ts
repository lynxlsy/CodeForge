import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()

// Flag para usar autenticação mockada temporariamente
const USE_MOCK_AUTH = true

// Flag para prevenir múltiplas chamadas simultâneas
let isSigningIn = false

// Usuário mockado para testes
const MOCK_USER = {
  uid: 'mock-user-123',
  displayName: 'Usuário Teste',
  email: 'teste@cdforge.shop',
  photoURL: null
}

export async function signInWithGoogle() {
  // Prevenir múltiplas chamadas simultâneas
  if (isSigningIn) {
    console.log('⚠️ Login já em andamento, ignorando nova tentativa');
    return { success: false, error: 'Login já em andamento' };
  }
  
  isSigningIn = true;
  
  if (USE_MOCK_AUTH) {
    // Autenticação mockada para testes
    console.log('Mock Google login successful');
    isSigningIn = false;
    return { success: true, user: MOCK_USER };
  }
  
  try {
    console.log('Attempting Google popup login...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google login successful:', result.user);
    isSigningIn = false;
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Google sign in error:', error);
    isSigningIn = false;
    return { success: false, error: (error as Error).message };
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