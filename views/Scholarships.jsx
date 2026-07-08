'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from '@/lib/navigation';
import SearchFilters from '@/components/SearchFilters';
import ScholarshipCard from '@/components/ScholarshipCard';
import PreLoginMatchTest from '@/components/PreLoginMatchTest';
import { api } from '@/lib/api';

function unwrapList(data) {
  if (Array.isArray(data)) return { scholarships: data, total: data.length };
  return { scholarships: data.scholarships || [], total: data.total || 0 };
}

export default function Scholarships({
  initialScholarships,
  initialTotal,
  initialStats,
  initialFilters = {},
}) {
  const searchParams = useSearchParams();
  const [scholarships, setScholarships] = useState(initialScholarships || []);
  const [total, setTotal] = useState(initialTotal || 0);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(!initialScholarships);
  const [filters, setFilters] = useState({
    field: initialFilters.field || searchParams.get('field') || '',
    country: initialFilters.country || searchParams.get('country') || '',
    degree: initialFilters.degree || searchParams.get('degree') || 'Doctoral',
    search: initialFilters.search || searchParams.get('search') || '',
  });

  const fetchScholarships = (f) => {
    setLoading(true);
    const params = { phd_only: 'true' };
    if (f.field) params.field = f.field;
    if (f.country) params.country = f.country;
    if (f.degree) params.degree = f.degree;
    if (f.search) params.search = f.search;

    api.scholarships.list(params)
      .then((data) => {
        const { scholarships: list, total: t } = unwrapList(data);
        setScholarships(list);
        setTotal(t);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!initialScholarships) fetchScholarships(filters);
    api.scholarships.stats().then(setStats).catch(() => {});
  }, []);

  const handleSearch = (f) => {
    setFilters(f);
    fetchScholarships(f);
  };

  const phdCount = stats?.phd_count || total;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="section-title">PhD Scholarships Catalog</h1>
        <p className="mt-2 text-gray-600">
          {phdCount ? `${phdCount.toLocaleString()}+ ` : ''}fully funded doctoral positions from universities and research councils worldwide.
          Full details require a free account.
        </p>
      </div>

      <div className="mb-8">
        <SearchFilters onSearch={handleSearch} initial={filters} />
      </div>

      <div id="match-test" className="mb-10">
        <PreLoginMatchTest scholarships={scholarships.slice(0, 15)} />
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-64 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : scholarships.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-lg font-medium text-gray-900">No PhD scholarships found</p>
          <p className="mt-2 text-sm text-gray-500">Try adjusting your search filters.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">
            {total || scholarships.length} PhD program{(total || scholarships.length) !== 1 ? 's' : ''} found
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((s) => <ScholarshipCard key={s.id} scholarship={s} />)}
          </div>
        </>
      )}
    </div>
  );
}
