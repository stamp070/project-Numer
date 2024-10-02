import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Base from './base.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <Base />
  </StrictMode>,
)
