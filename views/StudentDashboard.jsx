'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, formatPrice } from '@/lib/api';

const TRACK_STEPS = [
  { key: 'submitted', label: 'Details submitted', statuses: ['pending', 'reviewed', 'in_progress', 'accepted', 'rejected'] },
  { key: 'review', label: 'Under our review', statuses: ['reviewed', 'in_progress', 'accepted', 'rejected'] },
  { key: 'applying', label: 'Applying on your behalf', statuses: ['in_progress', 'accepted', 'rejected'] },
  { key: 'result', label: 'Result', statuses: ['accepted', 'rejected'] },
];

function stepIndexForStatus(status) {
  if (status === 'pending') return 0;
  if (status === 'reviewed') return 1;
  if (status === 'in_progress') return 2;
  if (status === 'accepted' || status === 'rejected') return 3;
  return 0;
}

function ApplicationProgressTrack({ application }) {
  const activeIdx = stepIndexForStatus(application.status);
  const isRejected = application.status === 'rejected';
  const isAccepted = application.status === 'accepted';

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 bg-white p-5">
        <div>
          <h3 className="font-semibold text-gray-900">{application.scholarship_title}</h3>
          <p className="text-sm text-brand-600">{application.university}</p>
          <p className="mt-1 text-xs text-gray-500">
            Submitted {new Date(application.created_at).toLocaleDateString()}
            {application.country ? ` · ${application.country}` : ''}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
            isAccepted
              ? 'bg-green-100 text-green-700'
              : isRejected
                ? 'bg-red-100 text-red-700'
                : application.status === 'in_progress'
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-amber-100 text-amber-700'
          }`}
        >
          {application.status === 'in_progress' ? 'Applying for you' : application.status}
        </span>
      </div>

      <div className="bg-gray-50 px-5 py-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Your application progress
        </p>
        <ol className="relative space-y-0">
          {TRACK_STEPS.map((step, idx) => {
            const done = idx < activeIdx || (idx === activeIdx && (isAccepted || (application.status !== 'rejected' && idx < 3)));
            const current = idx === activeIdx;
            const failed = isRejected && idx === activeIdx;

            return (
              <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
                {idx < TRACK_STEPS.length - 1 && (
                  <span
                    className={`absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5 ${
                      idx < activeIdx ? (isRejected && idx === activeIdx - 0 ? 'bg-red-300' : 'bg-brand-500') : 'bg-gray-200'
                    }`}
                    aria-hidden
                  />
                )}
                <span
                  className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    failed
                      ? 'bg-red-500 text-white'
                      : done || current
                        ? 'bg-brand-600 text-white'
                        : 'bg-white text-gray-400 ring-2 ring-gray-200'
                  }`}
                >
                  {failed ? '×' : done && !current ? '✓' : idx + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className={`text-sm font-medium ${current || done ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                    {step.key === 'result' && isAccepted && ' — Accepted'}
                    {step.key === 'result' && isRejected && ' — Not selected'}
                  </p>
                  {current && !isAccepted && !isRejected && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {application.status === 'pending' && 'We received your details and will review them shortly.'}
                      {application.status === 'reviewed' && 'Our team has reviewed your profile for this scholarship.'}
                      {application.status === 'in_progress' && 'We are submitting / following up on this scholarship for you.'}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [planStatus, setPlanStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      Promise.all([api.applications.mine(), api.orders.mine(), api.crm.myStatus()])
        .then(([a, o, status]) => {
          if (cancelled) return;
          setApplications(a);
          setOrders(o);
          setPlanStatus(status);
        })
        .catch(console.error)
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };
    load();
    const id = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/scholarships" className="btn-primary text-sm">Browse Scholarships</Link>
            <button type="button" onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <div className="card p-5">
            <p className="text-3xl font-bold text-brand-700">{applications.length}</p>
            <p className="text-sm text-gray-600">Applications</p>
          </div>
          <div className="card p-5">
            <p className="text-3xl font-bold text-brand-700">{orders.filter((o) => o.payment_status === 'paid').length}</p>
            <p className="text-sm text-gray-600">Active Plans</p>
          </div>
          <div className="card p-5">
            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
            <p className="text-sm text-gray-600">Account Email</p>
          </div>
          <div className="card p-5">
            <Link to="/plans" className="text-sm font-semibold text-brand-600 hover:text-brand-700">Browse Plans &rarr;</Link>
            <p className="text-sm text-gray-600">Mentorship</p>
          </div>
        </div>

        {planStatus?.has_active_plan && (
          <div className="card mb-8 border-l-4 border-l-brand-500 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase text-brand-600">Active Plan</p>
                <p className="text-lg font-semibold text-gray-900">{planStatus.plan_name}</p>
                <p className="mt-1 text-sm text-gray-600">{planStatus.message}</p>
              </div>
              {planStatus.progress > 0 && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-700">{planStatus.progress}%</p>
                  <p className="text-xs text-gray-500">Overall progress</p>
                </div>
              )}
            </div>
          </div>
        )}

        <h2 className="mb-4 text-lg font-semibold text-gray-900">My Purchases</h2>
        {orders.length === 0 ? (
          <div className="card mb-8 p-6 text-center text-gray-600">
            No purchased plans yet. <Link to="/plans" className="font-semibold text-brand-600">View plans</Link>
          </div>
        ) : (
          <div className="mb-8 space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="card flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">{o.plan_name}</p>
                  <p className="text-sm text-gray-500">{formatPrice(o.amount_cents)} · {new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  o.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{o.payment_status}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Scholarship progress</h2>
            <p className="text-sm text-gray-500">
              Track each scholarship where you submitted details — we apply on your behalf and update this live.
            </p>
          </div>
        </div>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-600">You haven&apos;t submitted details for any scholarships yet.</p>
            <Link to="/scholarships" className="btn-primary mt-4 inline-flex">Find Scholarships</Link>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {applications.map((a) => (
              <ApplicationProgressTrack key={a.id} application={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
