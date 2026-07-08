import { Suspense } from 'react';
import RequestGuidance from '@/views/RequestGuidance';

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-16 text-center">Loading...</div>}>
      <RequestGuidance />
    </Suspense>
  );
}
