import React from 'react'
import Login from './pages/login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/register'
import Dashboard from './pages/dashboard'



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
   
  )
}

export default App
