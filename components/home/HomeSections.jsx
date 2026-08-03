'use client';

import { useRef, useState } from 'react';
import { Link } from '@/lib/navigation';

const SUPPORT = [
  {
    title: 'Application And Admission Process',
    blurb: 'Portal execution, timelines, and checklist support from profile to submission.',
    tone: 'from-brand-200 via-mist to-white',
    mark: 'A',
  },
  {
    title: 'Scholarships Abroad',
    blurb: 'Research, private, and government funding pathways matched to your profile.',
    tone: 'from-accent-400/30 via-mist to-white',
    mark: 'S',
  },
  {
    title: 'Country And University Selection',
    blurb: 'Destination strategy across low, moderate, and high-difficulty corridors.',
    tone: 'from-brand-100 via-sand to-white',
    mark: 'C',
  },
  {
    title: 'Document Engineering',
    blurb: 'SOPs, research statements, CVs, and essays tailored per country and funder.',
    tone: 'from-mist via-brand-50 to-white',
    mark: 'D',
  },
];

const DESTINATIONS = [
  { name: 'Turkey', code: 'TR', scene: 'Mosques · campuses · research hubs' },
  { name: 'UAE', code: 'AE', scene: 'Global cities · innovation campuses' },
  { name: 'UK', code: 'GB', scene: 'Russell Group · doctoral funding' },
  { name: 'USA', code: 'US', scene: 'STEM labs · assistantships' },
  { name: 'Australia', code: 'AU', scene: 'Group of Eight · scholarships' },
  { name: 'Germany', code: 'DE', scene: 'DAAD · tuition-free tracks' },
  { name: 'China', code: 'CN', scene: 'CSC · research partnerships' },
  { name: 'Hungary', code: 'HU', scene: 'Stipendium Hungaricum' },
];

const FEATURED_COUNTRIES = [
  { name: 'UK', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80' },
  { name: 'Germany', img: 'https://images.unsplash.com/photo-1467269204594-59904b4fdda7?auto=format&fit=crop&w=800&q=80' },
  { name: 'Canada', img: 'https://images.unsplash.com/photo-1517935706615-2717063cabc5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Australia', img: 'https://images.unsplash.com/photo-1523482580671-b37b79250787?auto=format&fit=crop&w=800&q=80' },
  { name: 'Italy', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Spain', img: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80' },
  { name: 'China', img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80' },
  { name: 'USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
];

const PARTNERS = [
  'University of Sheffield', 'Queen Mary University of London', 'University of Alberta',
  'University of Manitoba', 'Arizona State University', 'University of Exeter',
  'Toronto Metropolitan', 'University of Windsor', 'Pace University',
  'Thompson Rivers', 'University of Saskatchewan', 'Acadia University',
];

const PROCEDURE = [
  {
    title: 'Initial Consultation',
    body: 'We map your goals, academics, and budget so every recommendation fits your pathway.',
    icon: '1',
  },
  {
    title: 'University And Course Selection',
    body: 'Shortlist destinations and programmes that align with your profile and funding odds.',
    icon: '2',
  },
  {
    title: 'Application Assistance',
    body: 'Documents, portal accounts, and submission readiness managed with clear milestones.',
    icon: '3',
  },
  {
    title: 'Visa Guidance And Support',
    body: 'Interview prep and file checks so you are ready for a smooth transition abroad.',
    icon: '4',
  },
];

const FAQ = [
  {
    q: 'Who is Scholaris?',
    a: 'Scholaris is a scholarship consultancy and postgraduate placement firm focused on research funding, private university awards, government schemes, and undergraduate admissions.',
  },
  {
    q: 'What is the mission of Scholaris?',
    a: 'To turn complex global application pipelines into a guided, milestone-based journey — from profile mapping to offer review.',
  },
  {
    q: 'What is the vision of Scholaris?',
    a: 'Global postgraduate mobility that is honest about outcomes, clear on pricing, and rigorous on document quality.',
  },
  {
    q: 'Why choose Scholaris?',
    a: 'Official 2026–27 fee architecture, dedicated execution queues, and transparent retainer / milestone policies.',
  },
  {
    q: 'Do you guarantee scholarships?',
    a: 'No. We provide advisory, documents, and portal execution. Admissions, funding, and visas are decided by institutions and governments.',
  },
];

function ArrowButtons({ onPrev, onNext, className = '' }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <button type="button" onClick={onPrev} className="carousel-btn" aria-label="Previous">
        <span className="text-lg leading-none">&lsaquo;</span>
      </button>
      <button type="button" onClick={onNext} className="carousel-btn" aria-label="Next">
        <span className="text-lg leading-none">&rsaquo;</span>
      </button>
    </div>
  );
}

export function SupportCarousel() {
  const ref = useRef(null);
  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <section className="relative bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="section-title">How Do We Support Students?</h2>
          <ArrowButtons onPrev={() => scroll(-1)} onNext={() => scroll(1)} className="hidden sm:flex" />
        </div>
        <div ref={ref} className="flex gap-5 overflow-x-auto pb-4 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SUPPORT.map((item) => (
            <article key={item.title} className="card min-w-[260px] max-w-sm flex-1 shrink-0 overflow-hidden p-0 sm:min-w-[300px]">
              <div className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${item.tone}`}>
                <div className="absolute left-6 top-8 h-20 w-28 rounded-full bg-brand-300/50 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-ink font-display text-2xl font-bold text-brand-200 shadow-nav">
                  {item.mark}
                </div>
              </div>
              <div className="flex items-end justify-between gap-3 p-5">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{item.blurb}</p>
                </div>
                <Link
                  to="/plans"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-brand-500 text-ink transition hover:bg-brand-500 hover:text-white"
                  aria-label={`Explore ${item.title}`}
                >
                  →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DestinationsBand() {
  const ref = useRef(null);
  const [tab, setTab] = useState('countries');
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });

  return (
    <section className="relative overflow-hidden bg-brand-600 py-16 md:py-20">
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-gold/20 blur-2xl" />
      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Choose Your Next Study Destination</h2>
        <Link to="/scholarships" className="btn-accent mt-5">
          View all destinations
        </Link>
        <div className="mt-8 flex items-center justify-center gap-6 text-sm font-semibold">
          {['countries', 'programmes'].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`capitalize pb-1 ${tab === id ? 'border-b-2 border-white text-white' : 'text-white/60'}`}
            >
              {id}
            </button>
          ))}
        </div>

        <div className="relative mt-8">
          <button type="button" onClick={() => scroll(-1)} className="carousel-btn absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 sm:flex md:-left-4" aria-label="Previous destinations">
            &lsaquo;
          </button>
          <button type="button" onClick={() => scroll(1)} className="carousel-btn absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 sm:flex md:-right-4" aria-label="Next destinations">
            &rsaquo;
          </button>
          <div ref={ref} className="flex gap-4 overflow-x-auto px-2 pb-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {(tab === 'countries' ? DESTINATIONS : DESTINATIONS.slice().reverse()).map((d) => (
              <Link key={d.name} to={`/scholarships?country=${encodeURIComponent(d.name)}`} className="group w-40 shrink-0 sm:w-44">
                <div className="stamp-card aspect-square rounded-sm p-3 transition group-hover:-translate-y-1">
                  <div className="inline-flex rounded bg-ink px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand-200">{d.code}</div>
                  <div className="mt-6 flex h-[55%] items-end justify-center rounded-md bg-gradient-to-t from-ink to-brand-500 p-2 text-[10px] font-medium leading-tight text-brand-100">
                    {d.scene}
                  </div>
                </div>
                <p className="mt-3 font-semibold text-white">{d.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedCountries() {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 360, behavior: 'smooth' });

  return (
    <section className="bg-mist py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="section-title">Featured Countries</h2>
          <ArrowButtons onPrev={() => scroll(-1)} onNext={() => scroll(1)} />
        </div>
        <div ref={ref} className="grid grid-flow-col grid-rows-2 gap-4 overflow-x-auto pb-2 auto-cols-[minmax(200px,1fr)] scroll-smooth sm:auto-cols-[minmax(220px,1fr)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FEATURED_COUNTRIES.map((c) => (
            <Link
              key={c.name}
              to={`/scholarships?country=${encodeURIComponent(c.name === 'UK' ? 'United Kingdom' : c.name === 'USA' ? 'United States' : c.name)}`}
              className="group relative h-36 overflow-hidden rounded-2xl sm:h-40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt={c.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
              <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold text-white drop-shadow">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PartnersBand() {
  const row = [...PARTNERS, ...PARTNERS];
  return (
    <section className="overflow-hidden bg-sand py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">Popular And Partner Universities</h2>
        <p className="mt-2 text-ink-muted">Universities and institutions we serve</p>
      </div>
      <div className="mt-10 space-y-4">
        {[0, 1].map((lane) => (
          <div key={lane} className="relative overflow-hidden">
            <div className={`flex w-max gap-4 ${lane === 1 ? '[animation-direction:reverse] animate-marquee' : 'animate-marquee'}`}>
              {row.map((name, i) => (
                <div
                  key={`${lane}-${name}-${i}`}
                  className="flex h-14 w-48 shrink-0 items-center justify-center rounded-xl bg-white/90 px-3 text-center text-xs font-semibold text-ink shadow-sm"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AboutPreview() {
  const [open, setOpen] = useState(0);
  const [tab, setTab] = useState('company');

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-6 border-b border-ink/10 text-sm font-semibold">
          {[
            { id: 'company', label: 'About Company' },
            { id: 'services', label: 'About Services' },
            { id: 'destinations', label: 'About Destinations' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`pb-3 ${tab === t.id ? 'border-b-2 border-brand-500 text-brand-600' : 'text-ink-muted'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-ink shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
              alt="Students collaborating"
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <div className="inline-block rounded-full bg-gold px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                Success Beyond Borders
              </div>
              <p className="font-display text-2xl font-bold text-white">Your trusted partner for global postgraduate mobility.</p>
            </div>
          </div>

          <div>
            {tab === 'company' && (
              <div className="space-y-3">
                {FAQ.map((item, i) => (
                  <button
                    key={item.q}
                    type="button"
                    onClick={() => setOpen(open === i ? -1 : i)}
                    className="w-full rounded-2xl border border-ink/10 bg-white px-5 py-4 text-left shadow-sm transition hover:border-ink/25"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-ink">{item.q}</span>
                      <span className="text-brand-500">{open === i ? '−' : '>'}</span>
                    </div>
                    {open === i && <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>}
                  </button>
                ))}
                <Link to="/about" className="mt-4 inline-flex font-semibold text-brand-600 hover:underline">
                  Read More →
                </Link>
              </div>
            )}
            {tab === 'services' && (
              <div className="rounded-3xl bg-mist p-8">
                <h3 className="font-display text-2xl font-bold text-ink">Service architecture</h3>
                <p className="mt-3 text-ink-muted leading-relaxed">
                  Research tiers, private university packages, government full-funding plans, and undergraduate admission placement — priced in PKR with clear retainer and milestone rules.
                </p>
                <Link to="/plans" className="btn-primary mt-6">View fee structure</Link>
              </div>
            )}
            {tab === 'destinations' && (
              <div className="rounded-3xl bg-mist p-8">
                <h3 className="font-display text-2xl font-bold text-ink">Destination corridors</h3>
                <p className="mt-3 text-ink-muted leading-relaxed">
                  From China, Italy, and Hungary to Germany, the UK, Netherlands, and Sweden — we structure applications by difficulty track and funding type.
                </p>
                <Link to="/scholarships" className="btn-primary mt-6">Browse scholarships</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProcedureSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-ink via-brand-600 to-brand-400 py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-white md:text-4xl">Our Procedure</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {PROCEDURE.map((step) => (
            <article key={step.title} className="relative rounded-2xl bg-white px-6 pb-6 pt-10 text-center shadow-soft">
              <div className="absolute -top-5 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-ink font-display text-lg font-bold text-brand-200 shadow-nav">
                {step.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutCopyStrip() {
  return (
    <section className="bg-[#f3f1ec] py-16">
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="section-title">About Scholaris</h2>
        <div className="mt-6 space-y-4 text-left text-base leading-relaxed text-ink/80">
          <p>
            For years we have helped students navigate funded study pathways — pairing honest{' '}
            <Link to="/guidance" className="font-semibold text-brand-600 underline">advice</Link> with clear{' '}
            <Link to="/plans" className="font-semibold text-brand-600 underline">funding plans</Link>.
          </p>
          <p>
            Use our guides to{' '}
            <Link to="/scholarships" className="font-semibold text-brand-600 underline">find the right programme</Link>, understand{' '}
            <Link to="/mentorship" className="font-semibold text-brand-600 underline">application coaching</Link>, and explore{' '}
            <Link to="/policies" className="font-semibold text-brand-600 underline">how our services work</Link>.
          </p>
          <p>
            Whether you are targeting government schemes or private university funding, Scholaris keeps documents, portals, and milestones in one place.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ContactOffice() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink">Islamabad Office</h2>
          <p className="mt-3 text-ink-muted leading-relaxed">
            To receive academic consultancy services, visit our office or book a free consultation online.
          </p>
          <div className="mt-8 space-y-6">
            {[
              { title: 'Office Location', body: 'Book a visit via consultation — address shared after scheduling.', mark: '01' },
              { title: 'Call Us', body: 'Request a callback from your dashboard or free consultation form.', mark: '02' },
              { title: 'Email Us', body: 'contact@scholaris.com', mark: '03' },
            ].map((row) => (
              <div key={row.title} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-sm font-bold text-brand-200">
                  {row.mark}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{row.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{row.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-ink/10 shadow-soft">
            <iframe
              title="Islamabad map"
              src="https://maps.google.com/maps?q=Islamabad%20Pakistan&t=&z=12&ie=UTF8&iwloc=&output=embed"
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="rounded-2xl bg-ink p-6 text-white shadow-soft">
            <p className="font-display text-4xl leading-none text-brand-300">&ldquo;</p>
            <p className="mt-2 text-lg leading-relaxed">
              Connect with Scholaris and open the world of educational programmes abroad you have been dreaming about.
            </p>
            <Link to="/guidance/request" className="btn-accent mt-5 !text-ink">
              Start free consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
