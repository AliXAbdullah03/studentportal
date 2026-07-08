'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import SharedApplicationsBoard from '@/components/SharedApplicationsBoard';

function ProgressBar({ value }) {
  return (
    <div className="h-2 rounded-full bg-gray-200">
      <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [traffic, setTraffic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);
  const [selectedConsultant, setSelectedConsultant] = useState({});

  const fetchTraffic = () => {
    setLoading(true);
    api.crm.traffic()
      .then(setTraffic)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTraffic(); }, []);

  const handleAssign = async (assignmentId) => {
    const consultantId = selectedConsultant[assignmentId];
    if (!consultantId) {
      alert('Please select a consultant');
      return;
    }
    setAssigning(assignmentId);
    try {
      await api.crm.assign(assignmentId, parseInt(consultantId, 10));
      fetchTraffic();
    } catch (err) {
      alert(err.message);
    } finally {
      setAssigning(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Traffic Control Dashboard</h1>
            <p className="text-sm text-gray-500">Client Operations Manager — {user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="btn-secondary text-sm">View Site</Link>
            <button type="button" onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <SharedApplicationsBoard title="Shared Applications Board" />
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : traffic && (
          <>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Plan fulfillment traffic</h2>
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="card p-5">
                <p className="text-3xl font-bold text-amber-600">{traffic.stats.awaiting}</p>
                <p className="text-sm text-gray-600">Awaiting Assignment</p>
              </div>
              <div className="card p-5">
                <p className="text-3xl font-bold text-brand-700">{traffic.stats.active}</p>
                <p className="text-sm text-gray-600">Active Clients</p>
              </div>
              <div className="card p-5">
                <p className="text-3xl font-bold text-green-600">{traffic.stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>

            {/* Consultant Capacity */}
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Consultant Capacity</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {traffic.consultants.map((c) => (
                  <div key={c.id} className={`card p-4 ${c.available_slots === 0 ? 'opacity-75' : ''}`}>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{c.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.available_slots > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {c.available_slots > 0 ? 'Available' : 'Full'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{c.active_clients} active / {c.max_capacity} max</p>
                    <ProgressBar value={c.utilization} />
                  </div>
                ))}
              </div>
            </section>

            {/* Awaiting Assignment */}
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Forwarded Clients — Assign Consultant</h2>
              {traffic.awaiting_assignment.length === 0 ? (
                <div className="card p-6 text-center text-gray-500">No clients awaiting assignment.</div>
              ) : (
                <div className="space-y-4">
                  {traffic.awaiting_assignment.map((c) => (
                    <div key={c.id} className="card p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">{c.student_name}</p>
                          <p className="text-sm text-gray-600">{c.student_email}</p>
                          <p className="mt-1 text-sm text-brand-600">{c.plan_name}</p>
                          {c.match_percentage != null && (
                            <span className="mt-1 inline-block text-xs text-gray-500">{c.match_percentage}% match</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedConsultant[c.id] || ''}
                            onChange={(e) => setSelectedConsultant({ ...selectedConsultant, [c.id]: e.target.value })}
                            className="input-field w-auto text-sm"
                          >
                            <option value="">Select consultant</option>
                            {traffic.consultants.filter((x) => x.available_slots > 0).map((x) => (
                              <option key={x.id} value={x.id}>
                                {x.name} ({x.available_slots} slots)
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            disabled={assigning === c.id}
                            onClick={() => handleAssign(c.id)}
                            className="btn-primary text-sm disabled:opacity-50"
                          >
                            Assign
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Active Clients Progress (QA Monitoring) */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Active Fulfillment Progress</h2>
              {traffic.active_clients.length === 0 ? (
                <div className="card p-6 text-center text-gray-500">No active clients.</div>
              ) : (
                <div className="space-y-4">
                  {traffic.active_clients.map((c) => (
                    <div key={c.id} className="card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{c.student_name}</p>
                          <p className="text-sm text-gray-600">Consultant: {c.consultant_name || 'Unassigned'}</p>
                          <p className="text-sm text-brand-600">{c.plan_name}</p>
                          <div className="mt-3">
                            <div className="mb-1 flex justify-between text-xs text-gray-500">
                              <span>Milestones</span>
                              <span>{c.milestones_completed}/{c.milestones_total} ({c.progress}%)</span>
                            </div>
                            <ProgressBar value={c.progress} />
                          </div>
                          <ul className="mt-3 space-y-1">
                            {c.milestones?.map((m) => (
                              <li key={m.id} className={`flex items-center gap-2 text-xs ${m.is_completed ? 'text-green-700' : 'text-gray-500'}`}>
                                <span>{m.is_completed ? '&#10003;' : '○'}</span>
                                {m.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          c.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>{c.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
