'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api, saveMatchProfile } from '@/lib/api';

export default function PreLoginMatchTest({ scholarships = [], compact = false }) {
  const [scholarshipId, setScholarshipId] = useState(scholarships[0]?.id?.toString() || '');
  const [profile, setProfile] = useState({
    gpa: '', ielts_score: '', gre_score: '', field_of_study: '',
    education_level: 'Doctoral', research_experience: '', has_research_proposal: false,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({ ...profile, [name]: type === 'checkbox' ? checked : value });
  };

  const runMatch = async (e) => {
    e.preventDefault();
    if (!scholarshipId) {
      setError('Select a PhD scholarship to test against');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await api.match.calculate({
        scholarship_id: parseInt(scholarshipId, 10),
        ...profile,
      });
      saveMatchProfile(profile);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card ${compact ? 'p-5' : 'p-6'}`}>
      <h2 className="text-lg font-bold text-gray-900">Pre-Login PhD Match Test</h2>
      <p className="mt-1 text-sm text-gray-600">
        Enter your academic profile to see your true match percentage — no account required.
      </p>

      <form onSubmit={runMatch} className="mt-5 space-y-4">
        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {scholarships.length > 0 && (
          <div>
            <label className="label-field">Target PhD Scholarship</label>
            <select
              value={scholarshipId}
              onChange={(e) => setScholarshipId(e.target.value)}
              className="input-field"
            >
              <option value="">Select scholarship</option>
              {scholarships.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label-field">GPA (4.0)</label>
            <input name="gpa" type="number" step="0.01" min="0" max="4" value={profile.gpa} onChange={handleChange} className="input-field" placeholder="3.7" />
          </div>
          <div>
            <label className="label-field">IELTS</label>
            <input name="ielts_score" type="number" step="0.5" min="0" max="9" value={profile.ielts_score} onChange={handleChange} className="input-field" placeholder="7.0" />
          </div>
          <div>
            <label className="label-field">GRE</label>
            <input name="gre_score" type="number" value={profile.gre_score} onChange={handleChange} className="input-field" placeholder="320" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Field of Study</label>
            <input name="field_of_study" value={profile.field_of_study} onChange={handleChange} className="input-field" placeholder="Computer Science" />
          </div>
          <div>
            <label className="label-field">Education Level</label>
            <input name="education_level" value={profile.education_level} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="has_research_proposal" checked={profile.has_research_proposal} onChange={handleChange} className="rounded" />
          I have a research proposal
        </label>

        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? 'Calculating...' : 'Calculate My Match %'}
        </button>
      </form>

      {result && (
        <div className="mt-6 rounded-lg bg-brand-50 p-6 text-center">
          <p className="text-5xl font-bold text-brand-700">{result.matchPercentage}%</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">Match for {result.scholarship_title}</p>
          <p className="mt-2 text-sm text-gray-600">
            {result.gapCount} profile gap{result.gapCount !== 1 ? 's' : ''} identified.
            Specific gaps are hidden until you request guidance.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href={`/scholarships/${result.scholarship_id}`} className="btn-secondary text-sm">
              View Scholarship
            </Link>
            <Link href="/register" className="btn-primary text-sm">
              Sign Up to Learn More
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
