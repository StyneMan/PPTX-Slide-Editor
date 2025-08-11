import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@mui/material'
import theme from './theme/index.ts'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme} >
      <Provider store={store} >
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>,
)
