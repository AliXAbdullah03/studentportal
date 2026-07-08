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
              Global Scholarships Hub is an online scholarship database for students from any country.
              We have scoured all corners of the globe to locate awards designed to assist students who
              wish to study in another country — so no matter who you are, we will have an award for you.
            </p>
            <p className="mt-4">
              Our platform combines a comprehensive scholarship finder with expert mentorship consultancy.
              Whether you need help finding the right scholarships or guidance through the application
              process, our team is here to support you every step of the way.
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
