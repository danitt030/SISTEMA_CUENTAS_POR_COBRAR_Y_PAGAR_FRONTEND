import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/professional-modules.css'
import App from './App.jsx'
import { suppressExtensionErrors } from './utils/suppressExtensionErrors.js'

// Suprimir errores causados por extensiones de Chrome
suppressExtensionErrors();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
