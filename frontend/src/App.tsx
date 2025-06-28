import React from 'react'
import Login from './pages/login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import LandingPage from './pages/LandingPage'
import TrackApplications from './pages/TrackApplications'
import ResumeATS from './pages/ResumeATS'



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/track" element={<TrackApplications />} />
        <Route path="/resume-ats" element={<ResumeATS />} />

      </Routes>
    </BrowserRouter>
   
  )
}

export default App
