'use client';

import { useState } from 'react';
import { Link } from '@/lib/navigation';

const GUIDES = [
  {
    id: 'roadmap',
    title: 'How to Get an International Scholarship',
    summary: 'A complete roadmap from research to acceptance for students planning to study abroad.',
    tag: 'Roadmap',
    sections: [
      'Start early — most scholarships have deadlines 6-12 months before your program starts.',
      'Research thoroughly using filters for your field, country, and degree level.',
      'Build a strong academic profile with good grades, test scores, and extracurricular activities.',
      'Prepare compelling application materials including personal statements and recommendation letters.',
      'Apply to multiple scholarships to increase your chances of success.',
    ],
  },
  {
    id: 'essay',
    title: 'Writing a Winning Scholarship Essay',
    summary: 'Tips and strategies for crafting essays that stand out to scholarship committees.',
    tag: 'Essays',
    sections: [
      'Understand the prompt and address every part of the question directly.',
      'Tell your unique story — committees want to know who you are beyond grades.',
      'Be specific about your goals and how the scholarship will help you achieve them.',
      'Show impact — demonstrate how your studies will benefit your community or field.',
      'Proofread carefully and have others review your essay before submitting.',
    ],
  },
  {
    id: 'usa',
    title: 'Scholarships for International Students in the U.S.',
    summary: 'Key funding opportunities for non-U.S. citizens pursuing education in America.',
    tag: 'USA',
    sections: [
      'University-specific merit scholarships — many U.S. schools offer aid to international students.',
      'Private organizations like MPOWER, Fulbright, and EducationUSA provide dedicated funding.',
      'Field-specific awards exist for STEM, business, arts, and other disciplines.',
      'Graduate assistantships and research positions can cover tuition and living expenses.',
      'Combine multiple smaller awards to build a comprehensive funding package.',
    ],
  },
  {
    id: 'docs',
    title: 'Preparing Your Application Documents',
    summary: 'Essential documents you need for most international scholarship applications.',
    tag: 'Documents',
    sections: [
      'Academic transcripts (official, translated if necessary)',
      'Standardized test scores (TOEFL, IELTS, GRE, SAT as required)',
      'Letters of recommendation from professors or employers',
      'Statement of Purpose or personal essay',
      'CV/Resume highlighting achievements and experience',
      'Proof of financial need (for need-based scholarships)',
    ],
  },
];

export default function Guidance() {
  const [active, setActive] = useState(GUIDES[0].id);
  const current = GUIDES.find((g) => g.id === active) || GUIDES[0];

  return (
    <div>
      <section className="relative overflow-hidden bg-ink py-16 text-white md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(69,164,174,0.35),_transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-300">Study Abroad Steps</p>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">Guidance Center</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
            Expert resources to help you navigate the scholarship application process successfully.
          </p>
        </div>
      </section>

      <section className="bg-mist py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="section-title">How Do We Guide You?</h2>
            <p className="mt-3 text-ink-muted">
              Pick a topic below. Each guide breaks the process into clear, actionable steps.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-2">
              {GUIDES.map((guide, index) => {
                const selected = guide.id === active;
                return (
                  <button
                    key={guide.id}
                    type="button"
                    onClick={() => setActive(guide.id)}
                    className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                      selected
                        ? 'border-ink bg-ink text-white shadow-nav'
                        : 'border-ink/10 bg-white text-ink hover:border-brand-400'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        selected ? 'bg-gold text-white' : 'bg-brand-100 text-brand-700'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span>
                      <span className={`block text-[11px] font-semibold uppercase tracking-wide ${selected ? 'text-brand-200' : 'text-brand-600'}`}>
                        {guide.tag}
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold leading-snug">{guide.title}</span>
                    </span>
                  </button>
                );
              })}
            </aside>

            <article className="relative overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-soft">
              <div className="border-b border-ink/10 bg-gradient-to-r from-brand-50 via-white to-sand px-6 py-6 sm:px-8">
                <span className="inline-flex rounded-full bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-200">
                  {current.tag}
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold text-ink md:text-3xl">{current.title}</h3>
                <p className="mt-2 max-w-2xl text-ink-muted">{current.summary}</p>
              </div>

              <ol className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                {current.sections.map((section, i) => (
                  <li
                    key={section}
                    className="group relative rounded-2xl border border-ink/8 bg-mist/60 p-5 transition hover:border-brand-300 hover:bg-white"
                  >
                    <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-brand-200">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm leading-relaxed text-ink-soft">{section}</p>
                  </li>
                ))}
              </ol>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 bg-sand/50 px-6 py-5 sm:px-8">
                <p className="text-sm text-ink-muted">Ready for hands-on support with documents and portals?</p>
                <div className="flex flex-wrap gap-2">
                  <Link to="/guidance/request" className="btn-accent !py-2 !text-sm">Request Guidance</Link>
                  <Link to="/plans" className="btn-secondary !py-2 !text-sm">View Plans</Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-brand-100 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="section-title">Need Personalized Help?</h2>
          <p className="mt-4 text-ink-muted">
            Our mentorship consultants provide one-on-one guidance tailored to your specific situation.
          </p>
          <Link to="/mentorship" className="btn-primary mt-6 inline-flex">Book a Consultation</Link>
        </div>
      </section>
    </div>
  );
}
