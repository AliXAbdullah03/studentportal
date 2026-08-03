'use client';

import { Link, useNavigate } from '@/lib/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  SupportCarousel,
  DestinationsBand,
  FeaturedCountries,
  PartnersBand,
  AboutPreview,
  ProcedureSection,
  AboutCopyStrip,
  ContactOffice,
} from '@/components/home/HomeSections';

function unwrapList(data) {
  return Array.isArray(data) ? data : (data.scholarships || []);
}

export default function Home({ initialStats }) {
  const navigate = useNavigate();
  const { isAuth, loading: authLoading, openAuthModal, authModalOpen } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState(initialStats || { phd_count: 0, total: 0 });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([
      api.scholarships.list({ featured: 'true' }),
      initialStats ? Promise.resolve(initialStats) : api.scholarships.stats(),
    ])
      .then(([feat, st]) => {
        setFeatured(unwrapList(feat).slice(0, 3));
        setStats(st);
      })
      .catch(console.error);
  }, [initialStats]);

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
    }, 900);
    return () => clearTimeout(t);
  }, [authLoading, isAuth, authModalOpen, openAuthModal]);

  const phdCount = stats.phd_count || stats.total || '1,000+';
  const countLabel = typeof phdCount === 'number' ? phdCount.toLocaleString() : phdCount;

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    navigate(`/scholarships?${params.toString()}`);
  };

  return (
    <div className="bg-white">
      {/* Hero — one composition, brand-first, full-bleed */}
      <section className="relative min-h-[88vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(232,93,76,0.22),_transparent_55%)]" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <p className="animate-fade-up font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
            Scholaris
          </p>
          <h1 className="animate-fade-up mt-4 max-w-xl font-display text-2xl font-semibold text-brand-200 sm:text-3xl" style={{ animationDelay: '80ms' }}>
            Global postgraduate mobility, guided end to end
          </h1>
          <p className="animate-fade-up mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg" style={{ animationDelay: '140ms' }}>
            Research scholarships, private funding, government schemes, and admissions support — built around clear milestones.
          </p>
          <div className="animate-fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: '200ms' }}>
            <button type="button" onClick={() => openAuthModal('choice')} className="btn-accent">
              Free Consultation
            </button>
            <Link to="/scholarships" className="btn-secondary !border-white/30 !bg-white/10 !text-white hover:!bg-white/20">
              Browse {countLabel}+ listings
            </Link>
          </div>

          <form onSubmit={handleSearch} className="animate-fade-up mt-10 flex max-w-xl overflow-hidden rounded-full bg-white shadow-nav" style={{ animationDelay: '260ms' }}>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by programme or country"
              className="min-w-0 flex-1 border-0 bg-transparent px-5 py-3.5 text-sm text-ink outline-none"
              aria-label="Search scholarships"
            />
            <button type="submit" className="m-1 rounded-full bg-gold px-5 text-sm font-bold text-white transition hover:bg-accent-600">
              Search
            </button>
          </form>
        </div>
      </section>

      <SupportCarousel />
      <DestinationsBand />
      <FeaturedCountries />
      <PartnersBand />
      <AboutPreview />
      <ProcedureSection />
      <AboutCopyStrip />

      {/* Featured scholarships strip */}
      <section className="border-y border-ink/10 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Featured Opportunities</h2>
              <p className="mt-2 text-ink-muted">A sample of funded pathways from our live catalog.</p>
            </div>
            <Link to="/scholarships" className="btn-primary">View all scholarships</Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featured.map((s) => (
              <Link key={s.id} to={`/scholarships/${s.id}`} className="card group block p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{s.country || 'Global'}</p>
                <h3 className="mt-2 font-display text-lg font-bold text-ink group-hover:text-brand-700 line-clamp-2">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-muted line-clamp-1">{s.university}</p>
                <p className="mt-4 text-sm font-semibold text-ink">{s.degree_level || 'PhD'} · {s.field_of_study}</p>
              </Link>
            ))}
            {!featured.length && (
              <p className="text-sm text-ink-muted md:col-span-3">Scholarships will appear here once the API is connected.</p>
            )}
          </div>
        </div>
      </section>

      <ContactOffice />
    </div>
  );
}
