'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@/lib/navigation';
import { api, formatPrice } from '@/lib/api';

const STEPS = [
  { step: 1, title: 'Discovery Call', desc: 'We assess your academic background, goals, and financial needs to understand your unique profile.' },
  { step: 2, title: 'Strategy Planning', desc: 'Our consultants create a personalized roadmap with targeted scholarships and application timelines.' },
  { step: 3, title: 'Application Coaching', desc: 'Step-by-step guidance on essays, recommendation letters, and supporting documents.' },
  { step: 4, title: 'Review & Submit', desc: 'Thorough review of your complete application package before submission.' },
  { step: 5, title: 'Interview Prep', desc: 'Mock interviews and coaching to help you confidently present your case.' },
  { step: 6, title: 'Post-Award Support', desc: 'Visa application guidance, pre-departure checklist, and ongoing support.' },
];

export default function Mentorship() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.plans.list().then(setPlans).catch(console.error);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold">Expert Mentorship Consultancy</h1>
          <p className="mt-4 text-lg text-brand-100 max-w-2xl mx-auto">
            Get personalized, step-by-step guidance from experienced consultants who have helped
            hundreds of students secure international scholarships.
          </p>
        </div>
      </section>

      {/* Process Steps */}
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

      {/* Packages */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">Choose Your Package</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((pkg, i) => (
              <div key={pkg.id} className={`card relative p-6 ${i === 1 ? 'ring-2 ring-brand-600' : ''}`}>
                {i === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                <p className="mt-2 text-2xl font-bold text-brand-600">{formatPrice(pkg.price_cents)}</p>
                <ul className="mt-4 space-y-2">
                  {(pkg.features || []).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">&#10003;</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => navigate(pkg.price_cents === 0 ? '/guidance/request' : `/checkout/${pkg.id}`)}
                  className={`mt-6 w-full ${i === 1 ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {pkg.price_cents === 0 ? 'Request Free Guidance' : 'Purchase Plan'}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/plans" className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all plans &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Request Guidance CTA */}
      <section id="consultation-form" className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="section-title mb-4">Request Free Guidance</h2>
          <p className="text-gray-600">
            Submit your academic profile for match analysis. Our advisors will review your dossier and contact you.
          </p>
          <Link to="/guidance/request" className="btn-primary mt-6 inline-flex">Request Guidance</Link>
        </div>
      </section>
    </div>
  );
}
