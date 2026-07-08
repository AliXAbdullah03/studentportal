'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import SharedApplicationsBoard from '@/components/SharedApplicationsBoard';

export default function ConsultantDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [toggling, setToggling] = useState(null);

  const fetchAssignments = () => {
    setLoading(true);
    api.crm.assignments()
      .then(setAssignments)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAssignments(); }, []);

  const handleToggleMilestone = async (milestoneId, current) => {
    setToggling(milestoneId);
    try {
      const updated = await api.crm.toggleMilestone(milestoneId, !current);
      setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      if (expanded === updated.id) setExpanded(updated.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setToggling(null);
    }
  };

  const active = assignments.filter((a) => ['assigned', 'in_progress'].includes(a.status));
  const completed = assignments.filter((a) => a.status === 'completed');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Consultant CRM Panel</h1>
            <p className="text-sm text-gray-500">Admissions Consultant — {user?.name}</p>
          </div>
          <button type="button" onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <SharedApplicationsBoard title="Shared Applications Board" />
        </div>

        <h2 className="mb-4 text-lg font-semibold text-gray-900">My plan clients</h2>
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <p className="text-3xl font-bold text-brand-700">{active.length}</p>
            <p className="text-sm text-gray-600">Assigned Clients</p>
          </div>
          <div className="card p-5">
            <p className="text-3xl font-bold text-amber-600">
              {active.reduce((sum, a) => sum + (a.milestones_total - a.milestones_completed), 0)}
            </p>
            <p className="text-sm text-gray-600">Pending Tasks</p>
          </div>
          <div className="card p-5">
            <p className="text-3xl font-bold text-green-600">{completed.length}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : active.length === 0 ? (
          <div className="card p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900">No assigned clients yet</h2>
            <p className="mt-2 text-gray-600">
              Clients will appear here once the Manager assigns them to you.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">My Clients</h2>
            {active.map((client) => (
              <div key={client.id} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === client.id ? null : client.id)}
                  className="flex w-full items-center justify-between p-5 text-left hover:bg-gray-50"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{client.student_name}</p>
                    <p className="text-sm text-gray-600">{client.student_email} · {client.plan_name}</p>
                    {client.scholarship_title && (
                      <p className="text-sm text-brand-600">{client.scholarship_title}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-brand-700">{client.progress}%</p>
                    <p className="text-xs text-gray-500">{client.milestones_completed}/{client.milestones_total} milestones</p>
                  </div>
                </button>

                {expanded === client.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-5">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Internal Progress Tracker
                    </h3>
                    <ul className="space-y-2">
                      {client.milestones?.map((m) => (
                        <li key={m.id} className="flex items-center gap-3 rounded-md bg-white p-3 shadow-sm">
                          <input
                            type="checkbox"
                            checked={m.is_completed === 1}
                            disabled={toggling === m.id}
                            onChange={() => handleToggleMilestone(m.id, m.is_completed === 1)}
                            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                          />
                          <span className={`text-sm ${m.is_completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {m.title}
                          </span>
                          {m.completed_at && (
                            <span className="ml-auto text-xs text-gray-400">
                              {new Date(m.completed_at).toLocaleDateString()}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                    {client.nationality && (
                      <p className="mt-4 text-xs text-gray-500">Nationality: {client.nationality}</p>
                    )}
                    {client.match_percentage != null && (
                      <p className="text-xs text-gray-500">Match score: {client.match_percentage}%</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {completed.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Completed Clients</h2>
            <div className="space-y-2">
              {completed.map((c) => (
                <div key={c.id} className="card flex items-center justify-between p-4 opacity-75">
                  <p className="font-medium text-gray-900">{c.student_name}</p>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Completed</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
