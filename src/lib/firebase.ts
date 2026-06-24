import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const hasConfig = !!firebaseConfig.apiKey

let app: FirebaseApp | undefined
let db: Firestore | undefined
let auth: Auth | undefined

if (hasConfig) {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  } catch (e) {
    // Si Firebase falla al inicializar (p.ej. API key inválida), dejamos db/auth undefined
    // y la app usa localStorage como fallback.
    console.warn('Firebase no disponible, usando localStorage:', e)
  }
}

// Mantenemos la firma de tipos original: en runtime fbOk() evita usar db/auth
// cuando no hay configuración. El cast solo satisface TypeScript.
export const dbResolved: Firestore = db as Firestore
export const authResolved: Auth = auth as Auth
export { dbResolved as db, authResolved as auth }
export default app
