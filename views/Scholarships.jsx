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

const FILTER_KEYS = [
  'field', 'country', 'degree', 'search', 'funding_type',
  'gpa', 'ielts', 'toefl', 'duolingo', 'gre', 'english_test',
  'requires_gre', 'deadline_before',
];

function buildParams(f) {
  const params = { phd_only: 'true' };
  for (const key of FILTER_KEYS) {
    if (f[key] !== undefined && f[key] !== null && f[key] !== '') {
      params[key] = f[key];
    }
  }
  return params;
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

  const fromUrl = Object.fromEntries(
    FILTER_KEYS.map((k) => [k, initialFilters[k] || searchParams.get(k) || '']),
  );
  if (!fromUrl.degree && !initialFilters.degree && !searchParams.get('degree')) {
    fromUrl.degree = 'Doctoral';
  }

  const [filters, setFilters] = useState(fromUrl);

  const fetchScholarships = (f) => {
    setLoading(true);
    api.scholarships.list(buildParams(f))
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
  const activeScoreFilters = ['gpa', 'ielts', 'toefl', 'duolingo', 'gre'].filter((k) => filters[k]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="section-title">PhD Scholarships Catalog</h1>
        <p className="mt-2 text-ink-muted">
          {phdCount ? `${Number(phdCount).toLocaleString()}+ ` : ''}doctoral positions with structured IELTS, TOEFL, GPA, and funding filters.
        </p>
      </div>

      <div className="mb-8">
        <SearchFilters onSearch={handleSearch} initial={filters} />
      </div>

      <div id="match-test" className="mb-10">
        <PreLoginMatchTest scholarships={scholarships.slice(0, 15)} />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">
          {loading ? 'Searching...' : `${total.toLocaleString()} result${total === 1 ? '' : 's'}`}
          {activeScoreFilters.length > 0 && (
            <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
              Score filters: {activeScoreFilters.map((k) => k.toUpperCase()).join(', ')}
            </span>
          )}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-mist" />
          ))}
        </div>
      ) : scholarships.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-white p-10 text-center">
          <p className="font-semibold text-ink">No scholarships match these filters</p>
          <p className="mt-2 text-sm text-ink-muted">Try lowering IELTS/TOEFL/GPA filters or clearing GRE requirements.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((s) => (
            <ScholarshipCard key={s.id} scholarship={s} />
          ))}
        </div>
      )}
    </div>
  );
}
