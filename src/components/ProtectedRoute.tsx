import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, isAdmin, loading } = useAuth()

  if (loading) return <div className="loading-state">Chargement…</div>
  if (!session) return <Navigate to="/connexion" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return <>{children}</>
}
