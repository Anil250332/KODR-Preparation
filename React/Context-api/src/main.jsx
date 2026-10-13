import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StoreContextProvider } from './context/Store'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreContextProvider>
        <App />
    </StoreContextProvider>
  </StrictMode>
)
