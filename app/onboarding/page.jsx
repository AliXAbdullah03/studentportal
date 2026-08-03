'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import OnboardingWizard from '@/views/OnboardingWizard';

export default function Page() {
  return (
    <ProtectedRoute roles={['student']}>
      <OnboardingWizard />
    </ProtectedRoute>
  );
}
