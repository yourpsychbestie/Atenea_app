import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export type UserRole = 'psychologist' | 'patient'

interface AuthUser {
  id: string
  email: string
  role: UserRole
}

interface AuthCtxValue {
  user: AuthUser | null
  loading: boolean
  login: (role: UserRole, email: string, password: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
}

const AuthCtx = createContext<AuthCtxValue>({
  user: null,
  loading: true,
  login: async () => ({}),
  logout: async () => {},
})

const STORAGE_KEY = 'zorrito_auth'
const ROLE_KEY = 'zorrito_role'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    const storedRole = localStorage.getItem(ROLE_KEY) as UserRole | null
    if (storedUser && storedRole) {
      try {
        const parsed = JSON.parse(storedUser)
        setUser({ ...parsed, role: storedRole })
      } catch {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(ROLE_KEY)
      }
    }
    setLoading(false)
  }, [])

  async function login(role: UserRole, email: string, password: string): Promise<{ error?: string }> {
    if (!isSupabaseConfigured) {
      const demoUser: AuthUser = { id: `demo_${Date.now()}`, email, role }
      setUser(demoUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser))
      localStorage.setItem(ROLE_KEY, role)
      return {}
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.user) {
      return { error: error?.message || 'Error al iniciar sesión' }
    }

    const authUser: AuthUser = { id: data.user.id, email: data.user.email || email, role }
    setUser(authUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    localStorage.setItem(ROLE_KEY, role)
    return {}
  }

  async function logout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(ROLE_KEY)
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
