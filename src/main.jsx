import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MainPage from './1. ProjectPage/MainPage'
import ProjWrite from './1. ProjectPage/ProjWrite'
import FreeLancerPage from './2. FreeLancer/FreeLancerPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/ProjectWrite" element={<ProjWrite />} />
        <Route path="/FreeView" element={<FreeLancerPage />} />
      </Routes>
    </Router>
  </StrictMode>
)
