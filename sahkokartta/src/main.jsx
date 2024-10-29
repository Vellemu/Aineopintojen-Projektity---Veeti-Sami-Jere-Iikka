import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CountryDataProvider } from './CountryContext';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CountryDataProvider>
      <App />
    </CountryDataProvider>
  </StrictMode>,
)
