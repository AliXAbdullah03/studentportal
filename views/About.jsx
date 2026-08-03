'use client';

import { useState } from 'react';
import { Link } from '@/lib/navigation';

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
    q: 'Why should I choose Scholaris?',
    a: 'Official 2026–27 fee architecture, dedicated execution queues, and transparent retainer / milestone policies across research, private, government, and undergraduate tracks.',
  },
  {
    q: 'Do you guarantee scholarships or admission?',
    a: 'No. Scholaris provides advisory, document preparation, and application execution. Outcomes remain with institutions and government bodies.',
  },
];

export default function About() {
  const [open, setOpen] = useState(0);

  return (
    <div>
      <section className="relative overflow-hidden bg-ink py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(69,164,174,0.35),_transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">About Company</p>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">About Scholaris</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
            Shaping global futures through honest consultancy and disciplined application execution.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-ink shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
              alt="Team collaboration"
              className="h-full w-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 space-y-2">
              <span className="inline-block rounded-full bg-gold px-3 py-1 text-xs font-bold text-white">Trusted Partner</span>
              <p className="max-w-xs font-display text-2xl font-bold text-white">Success beyond borders.</p>
            </div>
          </div>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <button
                key={item.q}
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full rounded-2xl border border-ink/10 bg-white px-5 py-4 text-left shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-ink">{item.q}</span>
                  <span className="text-brand-500">{open === i ? '−' : '>'}</span>
                </div>
                {open === i && <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>}
              </button>
            ))}
            <div className="flex flex-wrap gap-3 pt-4">
              <Link to="/plans" className="btn-primary">View Services</Link>
              <Link to="/guidance/request" className="btn-accent">Free Consultation</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
