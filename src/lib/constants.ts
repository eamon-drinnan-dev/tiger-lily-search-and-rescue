/**
 * Application Constants
 * @description Centralized constants to avoid magic strings throughout the application
 */

// Theme Modes
export const ThemeModes = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type ThemeMode = typeof ThemeModes[keyof typeof ThemeModes];
