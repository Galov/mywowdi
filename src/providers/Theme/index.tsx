'use client'

import React, { createContext, useContext } from 'react'

import type { Theme, ThemeContextType } from './types'

import { defaultTheme } from './shared'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: defaultTheme,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const setTheme = (_themeToSet: Theme | null) => null

  return (
    <ThemeContext.Provider value={{ setTheme, theme: defaultTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)
