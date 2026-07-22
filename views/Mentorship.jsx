'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@/lib/navigation';
import { api, formatPrice } from '@/lib/api';

const STEPS = [
  { step: 1, title: 'Discovery Call', desc: 'We assess your academic background, goals, and financial needs to understand your unique profile.' },
  { step: 2, title: 'Strategy Planning', desc: 'Our consultants create a personalized roadmap with targeted scholarships and application timelines.' },
  { step: 3, title: 'Document Preparation', desc: 'Custom SOPs, CVs, and research statements aligned to each destination and funding body.' },
  { step: 4, title: 'Portal Execution', desc: 'We manage university and scholarship portals once your documents and retainer are cleared.' },
  { step: 5, title: 'Interview Prep', desc: 'Mock interviews and coaching for research and institutional panels.' },
  { step: 6, title: 'Post-Offer Support', desc: 'Visa advisory, offer review, and ongoing milestone tracking.' },
];

export default function Mentorship() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.plans.list()
      .then((all) => setPlans(all.filter((p) => p.category === 'research').slice(0, 5)))
      .catch(console.error);
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">Scholaris Consultancy</p>
          <h1 className="mt-2 text-4xl font-bold">Scholarship Mentorship &amp; Placement</h1>
          <p className="mt-4 text-lg text-brand-100 max-w-2xl mx-auto">
            Expert advisory, document engineering, and portal execution for research, postgraduate, and undergraduate pathways.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">Our Step-by-Step Process</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="card p-6 relative">
                <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {s.step}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mt-2">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-4">Research / PhD Packages</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">
            Fixed-fee Tiers 1–2 and comprehensive application Tiers 3–5 from the Scholaris research fee structure.
          </p>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((pkg) => (
              <div key={pkg.id} className="card relative flex h-full flex-col p-6">
                {pkg.plan_type && (
                  <span className="w-fit rounded bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">{pkg.plan_type}</span>
                )}
                <h3 className="mt-2 text-lg font-bold text-gray-900">{pkg.name}</h3>
                <p className="mt-2 text-2xl font-bold text-brand-600">{formatPrice(pkg.price_cents, pkg.currency)}</p>
                {pkg.payment_note && <p className="mt-1 text-xs text-gray-500">{pkg.payment_note}</p>}
                <ul className="mt-4 flex-1 space-y-2">
                  {(pkg.features || []).slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-0.5 text-green-500">&#10003;</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => navigate(`/checkout/${pkg.id}`)}
                  className="btn-primary mt-6 w-full"
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/plans" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View full Scholaris catalog (Private, Government, Undergraduate) &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section id="consultation-form" className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="section-title mb-4">Request Free Guidance</h2>
          <p className="text-gray-600">
            Submit your academic profile for match analysis. Our advisors will review your dossier and contact you.
          </p>
          <Link to="/guidance/request" className="btn-primary mt-6 inline-flex">Request Guidance</Link>
          <p className="mt-4 text-sm text-gray-500">
            By engaging Scholaris you agree to our <Link to="/policies" className="font-semibold text-brand-600">policies</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
