'use client';

import { useEffect, useState } from 'react';
import { Link, useParams } from '@/lib/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ProfileGapsPanel from '@/components/ProfileGapsPanel';

export default function ScholarshipDetail({ initialScholarship }) {
  const { id } = useParams();
  const { isAuth } = useAuth();
  const [scholarship, setScholarship] = useState(initialScholarship || null);
  const [loading, setLoading] = useState(!initialScholarship);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.scholarships.get(id)
      .then(setScholarship)
      .catch(() => setError('Scholarship not found'))
      .finally(() => setLoading(false));
  }, [id, isAuth]);

  if (loading && !scholarship) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-lg text-gray-900">{error || 'Not found'}</p>
        <Link to="/scholarships" className="btn-primary mt-4 inline-flex">Back to Catalog</Link>
      </div>
    );
  }

  const deadline = scholarship.deadline
    ? new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Rolling deadline';

  const isGated = scholarship.gated || !isAuth;
  const description = isGated
    ? (scholarship.description_preview || 'Sign in to read the full program description.')
    : scholarship.description;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/scholarships" className="text-sm text-brand-600 hover:text-brand-700">&larr; Back to PhD Catalog</Link>

      <article className="mt-4">
        {scholarship.featured === 1 && (
          <span className="mb-3 inline-block rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold text-accent-600">
            Featured PhD Program
          </span>
        )}

        <h1 className="text-3xl font-bold text-gray-900">{scholarship.title}</h1>
        <p className="mt-2 text-lg font-medium text-brand-600">{scholarship.university}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">{scholarship.country}</span>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">{scholarship.degree_level}</span>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">{scholarship.field_of_study}</span>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="card p-4 text-center">
            <p className="text-xs font-medium uppercase text-gray-500">Award Amount</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{scholarship.amount || 'Varies'}</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-xs font-medium uppercase text-gray-500">Deadline</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{deadline}</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-xs font-medium uppercase text-gray-500">Degree Level</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{scholarship.degree_level}</p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            {isGated ? (
              <div className="mt-4 space-y-3">
                <p className="text-gray-600 leading-relaxed">{description}</p>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-800">
                    <Link to="/login" className="font-semibold underline">Sign in</Link> or{' '}
                    <Link to="/register" className="font-semibold underline">register free</Link> to unlock the full description,
                    eligibility requirements, and benefits.
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line">{scholarship.description}</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Eligibility &amp; Requirements</h2>
            {isGated ? (
              <div className="relative mt-2 overflow-hidden rounded-lg border border-gray-200 p-4">
                <p className="select-none blur-sm text-gray-600 leading-relaxed">
                  {scholarship.eligibility || 'Master\'s degree with strong GPA, IELTS 7.0+, research experience, research proposal, GRE scores, and relevant publications may be required for this doctoral program.'}
                </p>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 p-6 text-center">
                  <p className="text-sm font-semibold text-gray-900">Requirements hidden until login</p>
                  <Link to="/login" className="btn-primary mt-3 text-sm">Login to View Requirements</Link>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line">{scholarship.eligibility}</p>
            )}
          </section>

          {!isGated && scholarship.benefits && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Benefits</h2>
              <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line">{scholarship.benefits}</p>
            </section>
          )}

          {isAuth && <ProfileGapsPanel scholarshipId={scholarship.id} />}
        </div>

        {isAuth && (
          <div className="mt-10 flex flex-wrap gap-4 rounded-lg border border-brand-200 bg-brand-50 p-6">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Ready to apply?</h3>
              <p className="mt-1 text-sm text-gray-600">Submit your application through our platform.</p>
            </div>
            <Link to={`/scholarships/${scholarship.id}/apply`} className="btn-primary">Apply Now</Link>
          </div>
        )}

        {isAuth && (
          <div className="mt-4 flex flex-wrap gap-4 rounded-lg border border-accent-200 bg-accent-50 p-6">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Need expert help?</h3>
              <p className="mt-1 text-sm text-gray-600">Get a match analysis and one-time free consultation.</p>
            </div>
            <Link to={`/guidance/request/${scholarship.id}`} className="btn-accent">Request Guidance</Link>
          </div>
        )}
      </article>
    </div>
  );
}
