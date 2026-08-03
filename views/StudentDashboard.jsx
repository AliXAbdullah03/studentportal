'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, formatPrice } from '@/lib/api';
import DashboardShell from '@/components/DashboardShell';

const TRACK_STEPS = [
  { key: 'submitted', label: 'Details submitted' },
  { key: 'review', label: 'Under our review' },
  { key: 'applying', label: 'Applying on your behalf' },
  { key: 'result', label: 'Result' },
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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-5">
        <div>
          <h3 className="font-semibold text-slate-900">{application.scholarship_title}</h3>
          <p className="text-sm text-brand-600">{application.university}</p>
          <p className="mt-1 text-xs text-slate-500">
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

      <div className="bg-slate-50 px-5 py-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Your application progress
        </p>
        <ol>
          {TRACK_STEPS.map((step, idx) => {
            const done = idx < activeIdx || (idx === activeIdx && (isAccepted || (application.status !== 'rejected' && idx < 3)));
            const current = idx === activeIdx;
            const failed = isRejected && idx === activeIdx;

            return (
              <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
                {idx < TRACK_STEPS.length - 1 && (
                  <span
                    className={`absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5 ${
                      idx < activeIdx ? 'bg-brand-500' : 'bg-slate-200'
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
                        : 'bg-white text-slate-400 ring-2 ring-slate-200'
                  }`}
                >
                  {failed ? '×' : done && !current ? '✓' : idx + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className={`text-sm font-medium ${current || done ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.label}
                    {step.key === 'result' && isAccepted && ' — Accepted'}
                    {step.key === 'result' && isRejected && ' — Not selected'}
                  </p>
                  {current && !isAccepted && !isRejected && (
                    <p className="mt-0.5 text-xs text-slate-500">
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
        <Link
          to={`/dashboard/applications/${application.id}`}
          className="mt-2 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Open full tracker →
        </Link>
      </div>
    </div>
  );
}

const NAV_GROUPS = [
  {
    title: 'My account',
    items: [
      { id: 'overview', label: 'Overview', icon: 'home' },
      { id: 'matches', label: 'My Matches', icon: 'search' },
      { id: 'progress', label: 'Scholarship Progress', icon: 'progress' },
      { id: 'purchases', label: 'My Purchases', icon: 'plans' },
      { id: 'browse', label: 'Browse Scholarships', icon: 'search' },
      { id: 'profile', label: 'Edit Profile', icon: 'hr' },
    ],
  },
];

const TAB_META = {
  overview: { title: 'Overview', subtitle: 'Your applications, plans, and account at a glance' },
  matches: { title: 'Recommended for you', subtitle: 'Personalized matches from your profile, tests, and preferences' },
  progress: { title: 'Scholarship Progress', subtitle: 'Track each scholarship we are handling for you' },
  purchases: { title: 'My Purchases', subtitle: 'Mentorship plans and payment status' },
  browse: { title: 'Browse Scholarships', subtitle: 'Find more opportunities in the catalog' },
  profile: { title: 'Profile', subtitle: 'Update onboarding details anytime' },
};

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [planStatus, setPlanStatus] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredApps = statusFilter === 'all'
    ? applications
    : applications.filter((a) => a.status === statusFilter);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      Promise.all([
        api.applications.mine(),
        api.orders.mine(),
        api.crm.myStatus(),
        api.profile.recommendations(8).catch(() => ({ recommendations: [] })),
      ])
        .then(([a, o, status, rec]) => {
          if (cancelled) return;
          setApplications(a);
          setOrders(o);
          setPlanStatus(status);
          setRecommendations(rec.recommendations || []);
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

  const meta = TAB_META[tab] || { title: 'Dashboard', subtitle: '' };
  const paidPlans = orders.filter((o) => o.payment_status === 'paid').length;

  return (
    <DashboardShell
      storageKey="student_sidebar_open"
      brandTitle="Student Portal"
      roleLabel="Student"
      navGroups={NAV_GROUPS}
      activeTab={tab}
      onTabChange={(id) => {
        if (id === 'browse') {
          navigate('/scholarships');
          return;
        }
        if (id === 'profile') {
          navigate('/onboarding');
          return;
        }
        setTab(id);
      }}
      counts={{
        matches: recommendations.length,
        progress: applications.length,
        purchases: orders.length,
      }}
      title={meta.title}
      subtitle={meta.subtitle}
      onLogout={() => { logout(); navigate('/'); }}
      headerActions={(
        <Link to="/scholarships" className="btn-primary shrink-0 text-sm">Browse Scholarships</Link>
      )}
    >
      {tab === 'overview' && (
        <div>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{applications.length}</p>
              <p className="text-sm text-slate-600">Applications</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{paidPlans}</p>
              <p className="text-sm text-slate-600">Active Plans</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="truncate text-sm font-medium text-slate-900">{user?.email}</p>
              <p className="text-sm text-slate-600">Account Email</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Link to="/plans" className="text-sm font-semibold text-brand-600 hover:text-brand-700">Browse Plans →</Link>
              <p className="text-sm text-slate-600">Mentorship</p>
            </div>
          </div>

          {planStatus?.has_active_plan && (
            <div className="mb-8 rounded-xl border border-l-4 border-slate-200 border-l-brand-500 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase text-brand-600">Active Plan</p>
                  <p className="text-lg font-semibold text-slate-900">{planStatus.plan_name}</p>
                  <p className="mt-1 text-sm text-slate-600">{planStatus.message}</p>
                </div>
                {planStatus.progress > 0 && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-brand-700">{planStatus.progress}%</p>
                    <p className="text-xs text-slate-500">Overall progress</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900">Top matches for your profile</h3>
                <button type="button" onClick={() => setTab('matches')} className="text-sm font-semibold text-brand-600">
                  See all →
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {recommendations.slice(0, 4).map((r) => (
                  <Link key={r.id} to={`/scholarships/${r.id}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-slate-900 line-clamp-2">{r.title}</p>
                        <p className="mt-1 text-sm text-brand-600">{r.university}</p>
                        <p className="mt-1 text-xs text-slate-500">{r.country} · {r.degree_level}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                        {r.match_percentage}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {applications.length > 0 && (
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900">Recent applications</h3>
                <button type="button" onClick={() => setTab('progress')} className="text-sm font-semibold text-brand-600">
                  Track all →
                </button>
              </div>
              <div className="space-y-2">
                {applications.slice(0, 3).map((a) => (
                  <Link
                    key={a.id}
                    to={`/dashboard/applications/${a.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-brand-300"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{a.scholarship_title}</p>
                      <p className="text-xs text-slate-500">{a.university}</p>
                    </div>
                    <span className="text-xs font-semibold capitalize text-brand-700">
                      {a.status === 'in_progress' ? 'Applying for you' : a.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setTab('matches')} className="btn-primary text-sm">
              View my matches
            </button>
            <button type="button" onClick={() => setTab('progress')} className="btn-secondary text-sm">
              View scholarship progress
            </button>
            <button type="button" onClick={() => setTab('purchases')} className="btn-secondary text-sm">
              View purchases
            </button>
          </div>
        </div>
      )}

      {tab === 'matches' && (
        <div>
          <p className="mb-4 text-sm text-slate-500">
            Ranked using your GPA, English scores, field, research background, and preferred countries.
          </p>
          {loading ? (
            <p className="text-slate-500">Loading recommendations...</p>
          ) : recommendations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-slate-600">Complete or update your profile to unlock personalized matches.</p>
              <Link to="/onboarding" className="btn-primary mt-4 inline-flex">Update profile</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((r) => (
                <Link
                  key={r.id}
                  to={`/scholarships/${r.id}`}
                  className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{r.title}</p>
                    <p className="mt-1 text-sm text-brand-600">{r.university}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {r.country} · {r.field_of_study} · {r.degree_level}
                    </p>
                    {r.gaps?.length > 0 && (
                      <p className="mt-2 text-xs text-amber-700">Gap tip: {r.gaps[0]}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-brand-700">{r.match_percentage}%</p>
                    <p className="text-xs text-slate-500">match</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'progress' && (
        <div>
          <p className="mb-4 text-sm text-slate-500">
            Track each scholarship where you submitted details — we apply on your behalf and update this live.
          </p>
          {applications.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'pending', label: 'Submitted' },
                { key: 'reviewed', label: 'Under review' },
                { key: 'in_progress', label: 'Applying' },
                { key: 'accepted', label: 'Accepted' },
                { key: 'rejected', label: 'Not selected' },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusFilter === f.key
                      ? 'bg-brand-600 text-white'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : applications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-slate-600">You haven&apos;t submitted details for any scholarships yet.</p>
              <Link to="/scholarships" className="btn-primary mt-4 inline-flex">Find Scholarships</Link>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              No applications in this status.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredApps.map((a) => (
                <ApplicationProgressTrack key={a.id} application={a} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'purchases' && (
        <div>
          {orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              No purchased plans yet.{' '}
              <Link to="/plans" className="font-semibold text-brand-600">View plans</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div>
                    <p className="font-medium text-slate-900">{o.plan_name}</p>
                    <p className="text-sm text-slate-500">
                      {formatPrice(o.amount_cents)} · {new Date(o.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    o.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{o.payment_status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
