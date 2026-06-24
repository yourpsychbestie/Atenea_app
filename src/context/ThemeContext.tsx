import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface ThemeContextValue {
  dark: boolean
  toggle: () => void
}

const ThemeCtx = createContext<ThemeContextValue>({ dark: false, toggle: () => {} })

const STORAGE_KEY = 'zorrito_theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  }, [dark])

  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
