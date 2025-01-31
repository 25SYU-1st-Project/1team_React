import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MainPage from './1. ProjectPage/MainPage'
import ProjWrite from './1. ProjectPage/ProjWrite'
import FreeLancerPage from './2. FreeLancer/FreeLancerPage';
import MyProjectPage from './3.MyProject/MyProjectPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/ProjectWrite" element={<ProjWrite />} />

        <Route path="/FreeView" element={<FreeLancerPage />} />

        <Route path="/MyProject" element={<MyProjectPage />} />

      </Routes>
    </Router>
  </StrictMode>
)
