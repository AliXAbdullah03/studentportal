'use client';

import { Link, useNavigate } from '@/lib/navigation';
import { useEffect, useState } from 'react';
import PreLoginMatchTest from '@/components/PreLoginMatchTest';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

function unwrapList(data) {
  return Array.isArray(data) ? data : (data.scholarships || []);
}

function ProgramCard({ scholarship }) {
  const deadline = scholarship.deadline
    ? new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Rolling';

  const initials = (scholarship.university || 'U')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <article className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-36 bg-gradient-to-br from-[#1a3a5c] via-[#0d7377] to-[#14505c]">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, #e85d04 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 40%)',
          }}
        />
        <button
          type="button"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-400 hover:text-red-500"
          aria-label="Save"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <div className="absolute bottom-3 left-3 rounded bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#1a3a5c]">
          {scholarship.degree_level || 'PhD'}
        </div>
      </div>
      <div className="p-4">
        <Link to={`/scholarships/${scholarship.id}`}>
          <h3 className="line-clamp-2 text-base font-bold text-[#1a3a5c] group-hover:text-[#0d7377]">
            {scholarship.title}
          </h3>
        </Link>
        <div className="mt-2 flex items-start gap-2">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a3a5c]/10 text-[9px] font-bold text-[#1a3a5c]">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-800">{scholarship.university}</p>
            <p className="text-xs text-gray-500">
              {[scholarship.city, scholarship.country].filter(Boolean).join(', ') || scholarship.country}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
          <span>{scholarship.field_of_study}</span>
          <span>Deadline: {deadline}</span>
        </div>
      </div>
    </article>
  );
}

export default function Home({ initialStats }) {
  const navigate = useNavigate();
  const { isAuth, user, loading: authLoading, openAuthModal, authModalOpen } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [matchSamples, setMatchSamples] = useState([]);
  const [stats, setStats] = useState(initialStats || { phd_count: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('interesting');
  const [sidebar, setSidebar] = useState('programmes');

  useEffect(() => {
    Promise.all([
      api.scholarships.list({ featured: 'true' }),
      api.scholarships.list({ limit: '20' }),
      initialStats ? Promise.resolve(initialStats) : api.scholarships.stats(),
    ])
      .then(([feat, all, st]) => {
        setFeatured(unwrapList(feat).slice(0, 6));
        setMatchSamples(unwrapList(all).slice(0, 12));
        setStats(st);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [initialStats]);

  // Show signup popup for guests on first visit (session)
  useEffect(() => {
    if (authLoading || isAuth || authModalOpen) return;
    try {
      if (sessionStorage.getItem('auth_modal_seen')) return;
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => {
      openAuthModal('choice');
      try { sessionStorage.setItem('auth_modal_seen', '1'); } catch { /* ignore */ }
    }, 600);
    return () => clearTimeout(t);
  }, [authLoading, isAuth, authModalOpen, openAuthModal]);

  const phdCount = stats.phd_count || stats.total || '1,000+';
  const displayName = user?.name?.split(' ')[0] || '';

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    navigate(`/scholarships?${params.toString()}`);
  };

  const profilePct = isAuth ? 35 : 6;

  return (
    <div className="bg-white">
      {/* Search bar — Studyportals style */}
      <div className="bg-[#1a3a5c]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex gap-0 overflow-hidden rounded-sm shadow-lg">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Study & Country"
              className="min-w-0 flex-1 border-0 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#e85d04]"
              aria-label="Search scholarships"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#e85d04] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d45304]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Hero greeting */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-[#f4f5f7]">
        <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-48 sm:block md:w-64"
          aria-hidden
        >
          <div className="absolute -right-8 top-0 h-full w-16 -skew-x-12 bg-[#e85d04]" />
          <div className="absolute right-6 top-0 h-full w-12 -skew-x-12 bg-[#1a3a5c]" />
          <div className="absolute right-20 top-0 h-full w-8 -skew-x-12 bg-[#0d7377]/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <h1 className="text-3xl font-bold text-[#1a3a5c] sm:text-4xl">
            Hello{displayName ? ` ${displayName}` : ''},
          </h1>
          <p className="mt-1 text-xl font-semibold text-[#1a3a5c]/90 sm:text-2xl">
            Welcome to your profile!
          </p>
          {!isAuth && (
            <p className="mt-3 max-w-xl text-sm text-gray-600">
              Browse {typeof phdCount === 'number' ? phdCount.toLocaleString() : phdCount}+ PhD scholarships —
              {' '}
              <button type="button" onClick={() => openAuthModal('choice')} className="font-semibold text-[#0d7377] hover:underline">
                sign up free
              </button>
              {' '}to unlock full details and guidance.
            </p>
          )}
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-8 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`border-b-[3px] py-3 text-sm font-semibold transition ${
              activeTab === 'profile'
                ? 'border-[#1a3a5c] text-[#1a3a5c]'
                : 'border-transparent text-gray-500 hover:text-[#1a3a5c]'
            }`}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('interesting')}
            className={`border-b-[3px] py-3 text-sm font-semibold transition ${
              activeTab === 'interesting'
                ? 'border-[#1a3a5c] text-[#1a3a5c]'
                : 'border-transparent text-gray-500 hover:text-[#1a3a5c]'
            }`}
          >
            Interesting for you
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'profile' ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1a3a5c]">Your profile</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your profile is <strong>{profilePct}% complete.</strong>
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-[#0d7377]" style={{ width: `${profilePct}%` }} />
              </div>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Complete your profile to get better scholarship matches and personalized recommendations.
              </p>
              {isAuth ? (
                <Link to="/dashboard" className="mt-4 inline-flex text-sm font-semibold text-[#0d7377] hover:underline">
                  Go to dashboard →
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="mt-4 inline-flex text-sm font-semibold text-[#0d7377] hover:underline"
                >
                  Complete your profile →
                </button>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/scholarships" className="btn-primary !bg-[#1a3a5c] hover:!bg-[#14304d]">Browse catalog</Link>
                <Link to="/scholarships#match-test" className="btn-secondary">Test My Match %</Link>
              </div>
            </div>
            <div id="match-test">
              <PreLoginMatchTest scholarships={matchSamples} compact />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full shrink-0 lg:w-52">
              <nav className="space-y-1">
                {[
                  { id: 'programmes', label: 'Study programmes' },
                  { id: 'scholarships', label: 'Scholarships' },
                  { id: 'articles', label: 'Articles' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSidebar(item.id)}
                    className={`flex w-full items-center justify-between rounded px-3 py-2.5 text-left text-sm font-medium transition ${
                      sidebar === item.id
                        ? 'bg-[#e8f4f4] text-[#1a3a5c]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                    {sidebar === item.id && (
                      <span className="ml-2 h-8 w-1 rounded-full bg-[#0d7377]" />
                    )}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <div className="min-w-0 flex-1">
              {sidebar === 'programmes' && (
                <>
                  <h2 className="text-2xl font-bold text-[#1a3a5c]">Study programmes</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Your profile is {profilePct}% complete.
                  </p>
                  <p className="mt-3 max-w-2xl text-sm text-gray-600 leading-relaxed">
                    These suggestions are based on your profile and browsing. The more complete your profile,
                    the better we can recommend fully funded PhD opportunities.
                  </p>
                  {isAuth ? (
                    <Link to="/dashboard" className="mt-3 inline-flex text-sm font-semibold text-[#0d7377] hover:underline">
                      Complete your profile →
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openAuthModal('register')}
                      className="mt-3 inline-flex text-sm font-semibold text-[#0d7377] hover:underline"
                    >
                      Complete your profile →
                    </button>
                  )}

                  <div className="mt-8">
                    {loading ? (
                      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-72 animate-pulse rounded-lg bg-gray-100" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {featured.map((s) => (
                          <ProgramCard key={s.id} scholarship={s} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 text-center">
                    <Link
                      to="/scholarships"
                      className="inline-flex items-center gap-2 rounded border border-[#1a3a5c] px-5 py-2.5 text-sm font-semibold text-[#1a3a5c] transition hover:bg-[#1a3a5c] hover:text-white"
                    >
                      View all PhD scholarships →
                    </Link>
                  </div>
                </>
              )}

              {sidebar === 'scholarships' && (
                <div>
                  <h2 className="text-2xl font-bold text-[#1a3a5c]">Scholarships</h2>
                  <p className="mt-3 text-sm text-gray-600">
                    Explore {typeof phdCount === 'number' ? phdCount.toLocaleString() : phdCount}+ fully funded PhD listings
                    with filters by field, country, and deadline.
                  </p>
                  <Link to="/scholarships" className="btn-primary mt-6 inline-flex !bg-[#1a3a5c] hover:!bg-[#14304d]">
                    Open PhD Catalog
                  </Link>
                </div>
              )}

              {sidebar === 'articles' && (
                <div>
                  <h2 className="text-2xl font-bold text-[#1a3a5c]">Articles</h2>
                  <p className="mt-3 text-sm text-gray-600">
                    Guides on proposals, supervisor outreach, and eligibility for doctoral funding.
                  </p>
                  <Link to="/guidance" className="mt-6 inline-flex text-sm font-semibold text-[#0d7377] hover:underline">
                    Visit Guidance Center →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Compact match + guidance strip (preserve feature) */}
      <section className="border-t border-gray-200 bg-[#f4f5f7] py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-xl font-bold text-[#1a3a5c]">Built for PhD applicants</h2>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Curated doctoral funding — research grants and government PhD awards across 50+ countries.
              Run the free match test or request expert guidance.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/guidance" className="btn-primary !bg-[#0d7377] hover:!bg-[#0a5c5f]">Request Guidance</Link>
              <Link to="/plans" className="btn-secondary">View Plans</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { num: typeof phdCount === 'number' ? `${phdCount.toLocaleString()}+` : phdCount, label: 'PhD Listings' },
              { num: '50+', label: 'Countries' },
              { num: 'Free', label: 'Match Test' },
              { num: 'Expert', label: 'Gap Analysis' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-[#1a3a5c]">{stat.num}</p>
                <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
