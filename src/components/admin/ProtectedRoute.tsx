import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { LoadingState } from '@/components/ui/States';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingState message="Verifying session..." />;
  if (!session) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return <>{children}</>;
}
