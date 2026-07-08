import ProtectedRoute from '@/components/ProtectedRoute';
import ConsultantDashboard from '@/views/ConsultantDashboard';

export default function Page() {
  return (
    <ProtectedRoute roles={['consultant']}>
      <ConsultantDashboard />
    </ProtectedRoute>
  );
}
