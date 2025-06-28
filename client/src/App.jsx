"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NoteDetails from "./pages/NoteDetails"
import CreateNote from "./pages/CreateNote"
import EditNote from "./pages/EditNote"
import Navbar from "./components/Navbar"
import LoadingSpinner from "./components/LoadingSpinner"
import Profile from "./pages/Profile"
import ForgotPassword from "./pages/ForgotPassword"

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {user && <Navbar />}
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/note/:id" element={user ? <NoteDetails /> : <Navigate to="/login" />} />
          <Route path="/create" element={user ? <CreateNote /> : <Navigate to="/login" />} />
          <Route path="/edit/:id" element={user ? <EditNote /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
