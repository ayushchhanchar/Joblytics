import Login from './pages/login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import LandingPage from './pages/LandingPage'
import TrackApplications from './pages/TrackApplications'
import ResumeATS from './pages/ResumeATS'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Insights from './pages/Insights'
import { ThemeProvider } from './components/theme-provider'

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="joblytics-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/track" element={<TrackApplications />} />
          <Route path="/resume-ats" element={<ResumeATS />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App