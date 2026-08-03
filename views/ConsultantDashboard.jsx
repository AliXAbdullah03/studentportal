'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, formatPrice } from '@/lib/api';
import DashboardShell from '@/components/DashboardShell';
import SharedApplicationsBoard from '@/components/SharedApplicationsBoard';
import AvailabilityEditor from '@/components/consultant/AvailabilityEditor';
import ConsultantCalendar from '@/components/consultant/ConsultantCalendar';
import SessionStudio from '@/components/consultant/SessionStudio';
import EarningsPanel from '@/components/consultant/EarningsPanel';

const NAV_GROUPS = [
  {
    title: 'Workflow',
    items: [
      { id: 'board', label: 'Applications Board', icon: 'board' },
      { id: 'clients', label: 'My Clients', icon: 'clients' },
      { id: 'completed', label: 'Completed', icon: 'progress' },
    ],
  },
  {
    title: 'Schedule & studio',
    items: [
      { id: 'calendar', label: 'Calendar', icon: 'calendar' },
      { id: 'availability', label: 'Availability', icon: 'clock' },
      { id: 'studio', label: 'Sessions / Studio', icon: 'video' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { id: 'earnings', label: 'Earnings', icon: 'sales' },
    ],
  },
];

const TAB_META = {
  board: { title: 'Applications Board', subtitle: 'Shared live board — changes sync with Admin & Manager' },
  clients: { title: 'My Clients', subtitle: 'Assigned clients and milestone tracking' },
  completed: { title: 'Completed', subtitle: 'Finished client engagements' },
  calendar: { title: 'Calendar', subtitle: 'Week view — book and manage consultation sessions' },
  availability: { title: 'Availability', subtitle: 'Weekly hours and blocked dates' },
  studio: { title: 'Sessions / Studio', subtitle: 'Built-in Jitsi video room and session notes' },
  earnings: { title: 'Earnings', subtitle: 'Ledger, available balance, and payout requests' },
};

export default function ConsultantDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('board');
  const [assignments, setAssignments] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [studioSessionId, setStudioSessionId] = useState(null);
  const [bookAssignmentId, setBookAssignmentId] = useState('');

  const fetchAssignments = () => {
    setLoading(true);
    api.crm.assignments()
      .then(setAssignments)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchOverview = () => {
    api.consultant.overview().then(setOverview).catch(() => {});
  };

  useEffect(() => {
    fetchAssignments();
    fetchOverview();
  }, []);

  const handleToggleMilestone = async (milestoneId, current) => {
    setToggling(milestoneId);
    try {
      const updated = await api.crm.toggleMilestone(milestoneId, !current);
      setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      if (expanded === updated.id) setExpanded(updated.id);
      fetchOverview();
    } catch (err) {
      alert(err.message);
    } finally {
      setToggling(null);
    }
  };

  const openStudio = (sessionId) => {
    setStudioSessionId(sessionId || null);
    setTab('studio');
  };

  const bookForClient = (assignmentId) => {
    setBookAssignmentId(assignmentId);
    setTab('calendar');
  };

  const active = assignments.filter((a) => ['assigned', 'in_progress'].includes(a.status));
  const completed = assignments.filter((a) => a.status === 'completed');
  const meta = TAB_META[tab] || { title: 'Consultant', subtitle: '' };

  return (
    <DashboardShell
      storageKey="consultant_sidebar_open"
      brandTitle="Consultant Panel"
      roleLabel="Consultant"
      navGroups={NAV_GROUPS}
      activeTab={tab}
      onTabChange={(id) => {
        setTab(id);
        if (id !== 'studio') setStudioSessionId(null);
        if (id !== 'calendar') setBookAssignmentId('');
      }}
      counts={{
        clients: active.length,
        completed: completed.length,
        studio: overview?.upcoming_sessions || 0,
      }}
      title={meta.title}
      subtitle={meta.subtitle}
      onLogout={() => { logout(); navigate('/login'); }}
    >
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next session</p>
          {overview?.next_session ? (
            <button type="button" onClick={() => openStudio(overview.next_session.id)} className="mt-1 text-left">
              <p className="font-semibold text-slate-900 line-clamp-1">{overview.next_session.title}</p>
              <p className="text-xs text-brand-700">{new Date(overview.next_session.starts_at).toLocaleString()}</p>
            </button>
          ) : (
            <p className="mt-1 text-sm text-slate-500">None scheduled</p>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Open clients</p>
          <p className="mt-1 text-2xl font-bold text-brand-700">{overview?.open_clients ?? active.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Available balance</p>
          <button type="button" onClick={() => setTab('earnings')} className="mt-1 text-left">
            <p className="text-2xl font-bold text-brand-700">{formatPrice(overview?.available_cents || 0)}</p>
          </button>
        </div>
      </div>

      {tab === 'board' && <SharedApplicationsBoard title="Shared Applications Board" />}

      {tab === 'clients' && (
        <div>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-3xl font-bold text-brand-700">{active.length}</p>
              <p className="text-sm text-slate-600">Assigned Clients</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-3xl font-bold text-amber-600">
                {active.reduce((sum, a) => sum + (a.milestones_total - a.milestones_completed), 0)}
              </p>
              <p className="text-sm text-slate-600">Pending Tasks</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-3xl font-bold text-green-600">{completed.length}</p>
              <p className="text-sm text-slate-600">Completed</p>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : active.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="text-lg font-semibold text-slate-900">No assigned clients yet</h2>
              <p className="mt-2 text-slate-600">Clients will appear here once the Manager assigns them to you.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {active.map((client) => (
                <div key={client.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === client.id ? null : client.id)}
                    className="flex w-full items-center justify-between p-5 text-left hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{client.student_name}</p>
                      <p className="text-sm text-slate-600">{client.student_email} · {client.plan_name}</p>
                      {client.scholarship_title && (
                        <p className="text-sm text-brand-600">{client.scholarship_title}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-brand-700">{client.progress}%</p>
                      <p className="text-xs text-slate-500">{client.milestones_completed}/{client.milestones_total} milestones</p>
                    </div>
                  </button>

                  {expanded === client.id && (
                    <div className="border-t border-slate-200 bg-slate-50 p-5">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <button type="button" className="btn-primary text-xs" onClick={() => bookForClient(client.id)}>
                          Book session
                        </button>
                      </div>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Internal Progress Tracker
                      </h3>
                      <ul className="space-y-2">
                        {client.milestones?.map((m) => (
                          <li key={m.id} className="flex items-center gap-3 rounded-md bg-white p-3 shadow-sm">
                            <input
                              type="checkbox"
                              checked={m.is_completed === 1 || m.is_completed === true}
                              disabled={toggling === m.id}
                              onChange={() => handleToggleMilestone(m.id, m.is_completed === 1 || m.is_completed === true)}
                              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                            />
                            <span className={`text-sm ${m.is_completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                              {m.title}
                            </span>
                            {m.completed_at && (
                              <span className="ml-auto text-xs text-slate-400">
                                {new Date(m.completed_at).toLocaleDateString()}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                      {client.nationality && (
                        <p className="mt-4 text-xs text-slate-500">Nationality: {client.nationality}</p>
                      )}
                      {client.match_percentage != null && (
                        <p className="text-xs text-slate-500">Match score: {client.match_percentage}%</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'completed' && (
        <div>
          {completed.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              No completed clients yet.
            </div>
          ) : (
            <div className="space-y-2">
              {completed.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 opacity-90 shadow-sm">
                  <p className="font-medium text-slate-900">{c.student_name}</p>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Completed</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'calendar' && (
        <ConsultantCalendar
          clients={active}
          initialAssignmentId={bookAssignmentId}
          onOpenSession={openStudio}
        />
      )}

      {tab === 'availability' && <AvailabilityEditor />}

      {tab === 'studio' && (
        <SessionStudio
          sessionId={studioSessionId}
          onChanged={fetchOverview}
        />
      )}

      {tab === 'earnings' && <EarningsPanel />}
    </DashboardShell>
  );
}
