import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './index.tsx'

console.debug('lenix')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
