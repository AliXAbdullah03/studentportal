'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, getMatchProfile } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ProfileGapsPanel({ scholarshipId }) {
  const { isStudent } = useAuth();
  const [gaps, setGaps] = useState([]);
  const [matchPercentage, setMatchPercentage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isStudent || !scholarshipId) return;

    const profile = getMatchProfile();
    if (!profile.gpa && !profile.ielts_score) return;

    setLoading(true);
    api.match.calculateFull({ scholarship_id: scholarshipId, ...profile })
      .then((data) => {
        setMatchPercentage(data.matchPercentage);
        setGaps(data.gaps || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isStudent, scholarshipId]);

  if (!isStudent) return null;

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold text-gray-900">Your Profile Gaps</h2>
      {loading ? (
        <p className="mt-2 text-sm text-gray-500">Analyzing your profile...</p>
      ) : gaps.length === 0 ? (
        <div className="mt-3 rounded-lg border border-dashed border-brand-300 bg-brand-50 p-4">
          <p className="text-sm text-brand-800">
            Run the <Link href="/scholarships#match-test" className="font-semibold underline">match test</Link> first,
            or request guidance to reveal your specific gaps.
          </p>
          <Link href={`/guidance/request/${scholarshipId}`} className="btn-primary mt-3 inline-flex text-sm">
            Request Guidance to Unlock Gaps
          </Link>
        </div>
      ) : (
        <div className="relative mt-3 overflow-hidden rounded-lg border border-red-200">
          {matchPercentage != null && (
            <p className="bg-red-50 px-4 py-2 text-sm font-medium text-red-800">
              Your match: {matchPercentage}% — gaps below are blurred until you request guidance
            </p>
          )}
          <ul className="space-y-2 p-4 blur-sm select-none">
            {gaps.map((g) => (
              <li key={g} className="text-sm text-gray-700">• {g}</li>
            ))}
          </ul>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 p-6 text-center">
            <p className="text-sm font-semibold text-gray-900">Profile gaps are confidential</p>
            <p className="mt-1 text-xs text-gray-600">Only our advisors can reveal what you&apos;re missing</p>
            <Link href={`/guidance/request/${scholarshipId}`} className="btn-primary mt-4 text-sm">
              Request Guidance to Unlock
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
