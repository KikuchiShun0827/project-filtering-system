import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface User {
  email: string
  name: string
}

interface AuthContextValue {
  user: User | null
  login: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = 'pfs.user'

const load = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(load)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      // モックのため認証は行わず、入力されたメールアドレスをそのまま採用する
      login: (email) => {
        const next: User = { email, name: email.split('@')[0] || 'ユーザー' }
        setUser(next)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          /* noop */
        }
      },
      logout: () => {
        setUser(null)
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          /* noop */
        }
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
