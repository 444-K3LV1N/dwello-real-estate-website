import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AboutPage from './pages/AboutPage'
import DashboardPage from './pages/DashboardPage'
import InquiriesPage from './pages/InquiriesPage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PropertyDetailsPage from './pages/PropertyDetailsPage'
import PropertiesPage from './pages/PropertiesPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/properties" element={<PropertiesPage />} />

          <Route path="/about" element={<AboutPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/properties/:id"
            element={<PropertyDetailsPage />}
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute staffOnly>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/inquiries"
            element={
              <ProtectedRoute staffOnly>
                <InquiriesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}