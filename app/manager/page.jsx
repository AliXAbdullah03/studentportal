import ProtectedRoute from '@/components/ProtectedRoute';
import ManagerDashboard from '@/views/ManagerDashboard';

export default function Page() {
  return (
    <ProtectedRoute roles={['manager']}>
      <ManagerDashboard />
    </ProtectedRoute>
  );
}
