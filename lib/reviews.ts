import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

export interface Review {
  id?: string
  service: string
  rating: number
  message: string
  user: {
    uid: string
    name: string
    email: string
    photoURL?: string
  }
  createdAt: Timestamp | null
}

export async function addReview(reviewData: Omit<Review, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error adding review:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function listReviews(limit = 20) {
  try {
    const q = query(
      collection(db, 'reviews'),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const reviews: Review[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      reviews.push({
        id: doc.id,
        service: data.service,
        rating: data.rating,
        message: data.message,
        user: data.user,
        createdAt: data.createdAt || null
      })
    })
    
    return reviews.slice(0, limit)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}