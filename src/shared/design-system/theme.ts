/**
 * Theme configuration
 */

import { colors, spacing, typography, borderRadius, shadows, transitions } from './tokens'

export interface Theme {
  name: 'dark' | 'light'
  colors: {
    background: string
    foreground: string
    primary: string
    secondary: string
    muted: string
    accent: string
    destructive: string
    border: string
    input: string
    ring: string
  }
  spacing: typeof spacing
  typography: typeof typography
  borderRadius: typeof borderRadius
  shadows: typeof shadows
  transitions: typeof transitions
}

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: colors.gray[900],
    foreground: colors.gray[50],
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    muted: colors.gray[700],
    accent: colors.primary[600],
    destructive: colors.error[500],
    border: colors.gray[700],
    input: colors.gray[800],
    ring: colors.primary[500],
  },
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
}

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: colors.gray[50],
    foreground: colors.gray[900],
    primary: colors.primary[600],
    secondary: colors.secondary[600],
    muted: colors.gray[200],
    accent: colors.primary[700],
    destructive: colors.error[600],
    border: colors.gray[300],
    input: colors.gray[100],
    ring: colors.primary[600],
  },
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
}

export const themes = {
  dark: darkTheme,
  light: lightTheme,
}
