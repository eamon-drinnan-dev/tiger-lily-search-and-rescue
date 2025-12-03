import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import TigerLily from './TigerLily'
import { createAppTheme } from './styles/theme'
import { cssTokens } from './styles/tokens'

// Create the theme
const theme = createAppTheme()

// Inject CSS custom properties for LESS consumption
const style = document.createElement('style')
style.textContent = `:root { ${cssTokens} }`
document.head.appendChild(style)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TigerLily />
    </ThemeProvider>
  </StrictMode>,
)
