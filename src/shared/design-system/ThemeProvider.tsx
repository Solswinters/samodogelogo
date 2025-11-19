/**
 * Theme provider component
 */

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Theme, themes } from './theme'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: 'dark' | 'light'
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey)
      return themes[(saved as 'dark' | 'light') || defaultTheme]
    }
    return themes[defaultTheme]
  })

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme.name)
    localStorage.setItem(storageKey, theme.name)
  }, [theme, storageKey])

  const setTheme = (name: 'dark' | 'light') => {
    setThemeState(themes[name])
  }

  const toggleTheme = () => {
    setTheme(theme.name === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
