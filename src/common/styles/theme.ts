/**
 * Theme constants with CSS variables
 */

export const THEME = {
  colors: {
    primary: "#4CAF50",
    secondary: "#2196F3",
    accent: "#FF9800",
    danger: "#E91E63",
    success: "#4CAF50",
    warning: "#FF9800",
    info: "#2196F3",
    
    // Grayscale
    black: "#0a0a0a",
    gray900: "#1a1a1a",
    gray800: "#2a2a2a",
    gray700: "#333333",
    gray600: "#4a4a4a",
    gray500: "#6a6a6a",
    gray400: "#8a8a8a",
    gray300: "#aaaaaa",
    gray200: "#cccccc",
    gray100: "#eeeeee",
    white: "#ffffff",

    // Game specific
    playerDefault: "#4CAF50",
    playerHost: "#2196F3",
    obstacle: "#ff4444",
    ground: "#333333",
    background: "#0a0a0a",
  },

  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    xxl: "3rem", // 48px
  },

  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },

  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    base: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  transitions: {
    fast: "150ms ease-in-out",
    base: "300ms ease-in-out",
    slow: "500ms ease-in-out",
  },

  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export type Theme = typeof THEME;

