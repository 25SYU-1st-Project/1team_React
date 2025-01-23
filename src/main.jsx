import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainPage from './1. ProjectPage/MainPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainPage />
  </StrictMode>
)
