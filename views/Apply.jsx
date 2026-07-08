'use client';

import { useEffect, useState } from 'react';
import { Link, useParams } from '@/lib/navigation';
import { api } from '@/lib/api';

export default function Apply() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', nationality: '', current_education: '', message: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.scholarships.get(id)
      .then(setScholarship)
      .catch(() => setError('Scholarship not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.applications.submit({ scholarship_id: parseInt(id), ...form });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center">Loading...</div>;
  }

  if (!scholarship) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p>{error}</p>
        <Link to="/scholarships" className="btn-primary mt-4 inline-flex">Back</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="card p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
            &#10003;
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Application Submitted!</h2>
          <p className="mt-2 text-gray-600">
            Your application for <strong>{scholarship.title}</strong> has been received.
            We will review it and contact you at <strong>{form.email}</strong>.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/scholarships" className="btn-secondary">Browse More</Link>
            <Link to="/mentorship" className="btn-primary">Get Mentorship Help</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to={`/scholarships/${id}`} className="text-sm text-brand-600 hover:text-brand-700">&larr; Back to scholarship</Link>

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-gray-900">Apply for Scholarship</h1>
        <p className="mt-1 text-gray-600">{scholarship.title} — {scholarship.university}</p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-6">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div>
          <label htmlFor="full_name" className="label-field">Full Name *</label>
          <input id="full_name" name="full_name" required value={form.full_name} onChange={handleChange} className="input-field" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="label-field">Email *</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label htmlFor="phone" className="label-field">Phone</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div>
          <label htmlFor="nationality" className="label-field">Nationality *</label>
          <input id="nationality" name="nationality" required value={form.nationality} onChange={handleChange} className="input-field" />
        </div>

        <div>
          <label htmlFor="current_education" className="label-field">Current Education Level</label>
          <input id="current_education" name="current_education" value={form.current_education} onChange={handleChange} className="input-field" placeholder="e.g. Bachelor's in Computer Science" />
        </div>

        <div>
          <label htmlFor="message" className="label-field">Why should you receive this scholarship?</label>
          <textarea id="message" name="message" rows={4} value={form.message} onChange={handleChange} className="input-field" />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
