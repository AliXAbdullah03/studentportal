'use client';

import { Link } from '@/lib/navigation';

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="mt-4 text-lg text-brand-100 max-w-2xl mx-auto">
            Helping international students find funding and achieve their study abroad dreams since 2026.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Scholaris is a scholarship consultancy and postgraduate placement firm focused on global
              mobility — research scholarships, private university funding, government full-funding schemes,
              and undergraduate admission placement.
            </p>
            <p className="mt-4">
              Our platform combines a scholarship finder with end-to-end advisory: document preparation,
              portal execution, and milestone tracking under the official 2026–27 Scholaris fee structure.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              { title: 'For Students', desc: 'Browse scholarships, apply through our platform, and get expert mentorship to maximize your chances.' },
              { title: 'For Universities', desc: 'Partner with us to list your scholarships and reach thousands of qualified international students.' },
            ].map((item) => (
              <div key={item.title} className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/scholarships" className="btn-primary">Start Your Search</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
