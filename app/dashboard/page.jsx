import ProtectedRoute from '@/components/ProtectedRoute';
import StudentDashboard from '@/views/StudentDashboard';

export default function Page() {
  return (
    <ProtectedRoute roles={['student']}>
      <StudentDashboard />
    </ProtectedRoute>
  );
}
