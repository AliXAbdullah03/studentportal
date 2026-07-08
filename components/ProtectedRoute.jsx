'use client';

import { Navigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDashboardPath } from '@/lib/api';

export default function ProtectedRoute({ children, roles }) {
  const { isAuth, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuth) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}
