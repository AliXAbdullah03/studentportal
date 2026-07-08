import { Suspense } from 'react';
import { getScholarships, getScholarshipStats } from '@/lib/serverApi';
import Scholarships from '@/views/Scholarships';

export const metadata = {
  title: 'PhD Scholarships Catalog',
  description: 'Browse 1,000+ fully funded PhD scholarships. Filter by field, country, and test your match percentage before signup.',
};

async function ScholarshipsContent({ searchParams }) {
  const params = await searchParams;
  const [{ scholarships, total }, stats] = await Promise.all([
    getScholarships(params),
    getScholarshipStats(),
  ]);

  return (
    <Scholarships
      initialScholarships={scholarships}
      initialTotal={total}
      initialStats={stats}
      initialFilters={params}
    />
  );
}

export default function Page({ searchParams }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-center">Loading catalog...</div>}>
      <ScholarshipsContent searchParams={searchParams} />
    </Suspense>
  );
}
