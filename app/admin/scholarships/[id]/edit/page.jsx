import ProtectedRoute from '@/components/ProtectedRoute';
import AdminScholarshipForm from '@/views/admin/AdminScholarshipForm';

export default function Page() {
  return (
    <ProtectedRoute roles={['admin']}>
      <AdminScholarshipForm />
    </ProtectedRoute>
  );
}
