import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import AllProjectsPage from './components/AllProjectsPage.jsx'
import AllBlogsPage from './components/AllBlogsPage.jsx'
import Cursor from './components/Cursor.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Cursor />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/blogs" element={<AllBlogsPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
