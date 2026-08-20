import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function FullScreenLoader() {
  return (
    <div className="dash-flex dash-items-center dash-justify-center" style={{ height: '100vh' }}>
      <div className="dash-size-8 dash-animate-spin dash-rounded-full dash-border-4 dash-border-border dash-border-t-primary" />
    </div>
  );
}

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}