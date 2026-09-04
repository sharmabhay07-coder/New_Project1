import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { ROLES } from '../../constants/roles'

export default function AdminRoute() {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  if (user?.role !== ROLES.ADMIN) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}