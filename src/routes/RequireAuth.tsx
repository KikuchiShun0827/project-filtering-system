import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

const RequireAuth = ({ children }: { children: ReactElement }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default RequireAuth
