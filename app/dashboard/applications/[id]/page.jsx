import ProtectedRoute from '@/components/ProtectedRoute';
import ApplicationDetail from '@/views/ApplicationDetail';

export default function Page() {
  return (
    <ProtectedRoute roles={['student', 'admin', 'manager', 'consultant']}>
      <ApplicationDetail />
    </ProtectedRoute>
  );
}
