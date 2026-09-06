import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, staffOnly = false }) {
  const { loading, user, isStaff } = useAuth()
  if (loading) return <div className="page-state">Checking your session...</div>
  if (!user) return <Navigate to="/login" replace />
  if (staffOnly && !isStaff) return <Navigate to="/" replace />
  return children
}
