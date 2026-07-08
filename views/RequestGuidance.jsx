'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function RequestGuidance() {
  const { id: scholarshipId } = useParams();
  const [searchParams] = useSearchParams();
  const { user, isAuth, isStudent } = useAuth();
  const navigate = useNavigate();

  const [scholarship, setScholarship] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', nationality: '', target_country: '',
    field_of_study: '', education_level: '', goals: '', message: '',
    gpa: '', ielts_score: '', gre_score: '', research_experience: '',
    has_research_proposal: false, work_experience: '',
  });
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        full_name: user.name || f.full_name,
        email: user.email || f.email,
        phone: user.phone || f.phone,
        nationality: user.nationality || f.nationality,
      }));
    }
  }, [user]);

  useEffect(() => {
    const sid = scholarshipId || searchParams.get('scholarship');
    if (sid) {
      api.scholarships.get(sid).then(setScholarship).catch(console.error).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [scholarshipId, searchParams]);

  const runMatch = async () => {
    if (!scholarship) return;
    try {
      const result = await api.match.calculate({
        scholarship_id: scholarship.id,
        gpa: form.gpa,
        ielts_score: form.ielts_score,
        gre_score: form.gre_score,
        field_of_study: form.field_of_study,
        education_level: form.education_level,
        research_experience: form.research_experience,
        has_research_proposal: form.has_research_proposal,
        work_experience: form.work_experience,
      });
      setMatchResult(result);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuth) {
      navigate(`/login?redirect=/guidance/request${scholarship ? `/${scholarship.id}` : ''}`);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (scholarship) fd.append('scholarship_id', scholarship.id);
      if (cvFile) fd.append('cv', cvFile);

      await api.guidance.request(fd);
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

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="card p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">&#10003;</div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Guidance Request Submitted</h2>
          {matchResult && (
            <p className="mt-2 text-lg font-semibold text-brand-600">
              Your match: {matchResult.matchPercentage}%
            </p>
          )}
          <p className="mt-2 text-gray-600">
            Your dossier has been sent to our advisors. Specific profile gaps will be revealed during your consultation — they are not shown here by design.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/plans" className="btn-primary">View Service Plans</Link>
            <Link to="/dashboard" className="btn-secondary">My Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to={scholarship ? `/scholarships/${scholarship.id}` : '/mentorship'} className="text-sm text-brand-600 hover:text-brand-700">
        &larr; Back
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">Request Guidance</h1>
      <p className="mt-1 text-gray-600">
        One-time free consultation. We&apos;ll analyze your profile and compile a dossier for our advisors.
      </p>

      {scholarship && (
        <div className="card mt-6 p-4">
          <p className="text-sm text-gray-500">Target scholarship</p>
          <p className="font-semibold text-gray-900">{scholarship.title}</p>
          <p className="text-sm text-brand-600">{scholarship.university}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card mt-6 space-y-5 p-6">
        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {!isAuth && (
          <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            Please <Link to="/login" className="font-semibold underline">sign in</Link> or{' '}
            <Link to="/register" className="font-semibold underline">register</Link> to submit your guidance request.
          </div>
        )}

        <h3 className="font-semibold text-gray-900">Academic Profile (for match analysis)</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label-field">GPA (4.0 scale)</label>
            <input name="gpa" type="number" step="0.01" min="0" max="4" value={form.gpa} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field">IELTS Score</label>
            <input name="ielts_score" type="number" step="0.5" min="0" max="9" value={form.ielts_score} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field">GRE Score</label>
            <input name="gre_score" type="number" value={form.gre_score} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Field of Study</label>
            <input name="field_of_study" value={form.field_of_study} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field">Education Level</label>
            <input name="education_level" value={form.education_level} onChange={handleChange} className="input-field" placeholder="e.g. Master's" />
          </div>
        </div>

        <div>
          <label className="label-field">Research Experience</label>
          <textarea name="research_experience" rows={2} value={form.research_experience} onChange={handleChange} className="input-field" />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="has_research_proposal" checked={form.has_research_proposal} onChange={handleChange} className="rounded border-gray-300" />
          I have a formal research proposal
        </label>

        {scholarship && (
          <div>
            <button type="button" onClick={runMatch} className="btn-secondary text-sm">Calculate Match %</button>
            {matchResult && (
              <div className="mt-3 rounded-lg bg-brand-50 p-4">
                <p className="text-2xl font-bold text-brand-700">{matchResult.matchPercentage}% Match</p>
                <p className="mt-1 text-sm text-gray-600">
                  {matchResult.gapCount} potential gap{matchResult.gapCount !== 1 ? 's' : ''} identified — details shared during your consultation only.
                </p>
              </div>
            )}
          </div>
        )}

        <hr />
        <h3 className="font-semibold text-gray-900">Contact Information</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Full Name *</label>
            <input name="full_name" required value={form.full_name} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field">Email *</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div>
          <label className="label-field">Upload CV (optional)</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files?.[0] || null)} className="input-field" />
        </div>

        <div>
          <label className="label-field">Your Goals</label>
          <textarea name="goals" rows={3} value={form.goals} onChange={handleChange} className="input-field" />
        </div>

        <button type="submit" disabled={submitting || !isAuth} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Request Free Guidance'}
        </button>
      </form>
    </div>
  );
}
