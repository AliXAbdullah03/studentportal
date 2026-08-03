'use client';

import { useEffect, useState } from 'react';
import { Link, useParams } from '@/lib/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function Apply() {
  const { id } = useParams();
  const { user, isAuth, isStudent, openAuthModal, loading: authLoading } = useAuth();
  const [scholarship, setScholarship] = useState(null);
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', nationality: '', current_education: '', message: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const [error, setError] = useState('');
  const [existingId, setExistingId] = useState(null);

  useEffect(() => {
    api.scholarships.get(id)
      .then(setScholarship)
      .catch(() => setError('Scholarship not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      full_name: prev.full_name || user.name || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.phone || '',
      nationality: prev.nationality || user.nationality || '',
    }));
  }, [user]);

  useEffect(() => {
    if (!isStudent || !id) return;
    api.applications.mine()
      .then((apps) => {
        const hit = (apps || []).find((a) => String(a.scholarship_id) === String(id));
        if (hit) setExistingId(hit.id);
      })
      .catch(() => {});
  }, [isStudent, id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuth) {
      openAuthModal('login');
      return;
    }
    if (!isStudent) {
      setError('Please sign in with a student account to submit details.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const created = await api.applications.submit({ scholarship_id: id, ...form });
      setSuccessId(created.id);
    } catch (err) {
      if (err.status === 409 && err.data?.application_id) {
        setExistingId(err.data.application_id);
        setError('You already applied for this scholarship.');
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
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

  if (existingId && !successId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900">Already tracking this scholarship</h2>
          <p className="mt-2 text-gray-600">
            You already submitted details for <strong>{scholarship.title}</strong>.
            Follow live progress, notes, and documents from your tracker.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to={`/dashboard/applications/${existingId}`} className="btn-primary">
              Track application
            </Link>
            <Link to="/dashboard" className="btn-secondary">Student dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  if (successId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="card p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
            &#10003;
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Details received</h2>
          <p className="mt-2 text-gray-600">
            Your details for <strong>{scholarship.title}</strong> are in.
            Scholaris will apply on your behalf — track every status update here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to={`/dashboard/applications/${successId}`} className="btn-primary">
              Track this application
            </Link>
            <Link to="/dashboard" className="btn-secondary">All applications</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to={`/scholarships/${id}`} className="text-sm text-brand-600 hover:text-brand-700">&larr; Back to scholarship</Link>

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-gray-900">Submit your details</h1>
        <p className="mt-1 text-gray-600">{scholarship.title} — {scholarship.university}</p>
        <p className="mt-2 text-sm text-slate-500">
          You do not apply to the funder yourself. Scholaris uses these details to apply and keeps you updated in your tracker.
        </p>
      </div>

      {!isAuth && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <button type="button" onClick={() => openAuthModal('login')} className="font-semibold underline">
            Sign in
          </button>
          {' '}with your student account so we can attach this application to your progress tracker.
        </div>
      )}

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
          <label htmlFor="message" className="label-field">Anything we should know?</label>
          <textarea id="message" name="message" rows={4} value={form.message} onChange={handleChange} className="input-field" placeholder="Goals, constraints, preferred programs..." />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Submitting...' : isAuth ? 'Submit & track application' : 'Sign in to submit'}
        </button>
      </form>
    </div>
  );
}
