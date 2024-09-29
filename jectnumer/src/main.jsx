import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Bi from './root/bisection.jsx'
import Nav from './component/nav.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Nav />
    <Bi />
  </StrictMode>,
)
