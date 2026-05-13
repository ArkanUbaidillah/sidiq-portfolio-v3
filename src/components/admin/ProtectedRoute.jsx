import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="font-mono text-emerald-500 animate-pulse">Authenticating...</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/sidiq-admin" replace />
  }

  return children
}
