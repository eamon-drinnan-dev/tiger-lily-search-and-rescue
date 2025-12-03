/**
 * MUI theme configuration (dark mode only)
 * Adheres to NASA HFES-300 contrast requirements
 */

import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { tokens } from './tokens';

/**
 * Create the application theme (dark mode)
 */
export function createAppTheme() {
  const themeOptions: ThemeOptions = {
    palette: {
      mode: 'dark',
      primary: {
        main: tokens.palette.dark.primary,
      },
      secondary: {
        main: tokens.palette.dark.secondary,
      },
      background: {
        default: tokens.surface.surface0,
        paper: tokens.surface.surface1,
      },
      text: {
        primary: tokens.surface.textPrimary,
        secondary: tokens.surface.textSecondary,
      },
      error: {
        main: tokens.alert.critical,
      },
      warning: {
        main: tokens.alert.warning,
      },
      info: {
        main: tokens.alert.info,
      },
    },
    typography: {
      fontFamily: '"Rajdhani", sans-serif',
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 600,
      h6: {
        fontWeight: 600,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      },
      subtitle1: {
        fontWeight: 600,
        letterSpacing: '0.5px',
      },
      subtitle2: {
        fontWeight: 600,
        letterSpacing: '0.5px',
      },
      button: {
        textTransform: 'uppercase',
        fontWeight: 600,
        letterSpacing: '0.5px',
      },
      body1: {
        fontWeight: 400,
      },
      body2: {
        fontWeight: 400,
      },
      caption: {
        fontWeight: 400,
      },
    }
  };

  return createTheme(themeOptions);
}
