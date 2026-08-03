'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import DashboardShell from '@/components/DashboardShell';
import SharedApplicationsBoard from '@/components/SharedApplicationsBoard';
import PayoutsAdminPanel from '@/components/consultant/PayoutsAdminPanel';

function ProgressBar({ value }) {
  return (
    <div className="h-2 rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}

const NAV_GROUPS = [
  {
    title: 'Workflow',
    items: [
      { id: 'board', label: 'Applications Board', icon: 'board' },
      { id: 'traffic', label: 'Traffic Control', icon: 'traffic' },
      { id: 'capacity', label: 'Consultant Capacity', icon: 'clients' },
      { id: 'active', label: 'Active Progress', icon: 'progress' },
      { id: 'payouts', label: 'Consultant Payouts', icon: 'sales' },
    ],
  },
];

const TAB_META = {
  board: { title: 'Applications Board', subtitle: 'Shared live board — changes sync with Admin & Consultant' },
  traffic: { title: 'Traffic Control', subtitle: 'Assign forwarded clients to consultants' },
  capacity: { title: 'Consultant Capacity', subtitle: 'Workload and availability overview' },
  active: { title: 'Active Progress', subtitle: 'Monitor fulfillment milestones' },
  payouts: { title: 'Consultant Payouts', subtitle: 'Approve and mark consultant payout requests as paid' },
};

export default function ManagerDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('board');
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
      await api.crm.assign(assignmentId, consultantId);
      fetchTraffic();
    } catch (err) {
      alert(err.message);
    } finally {
      setAssigning(null);
    }
  };

  const meta = TAB_META[tab] || { title: 'Manager', subtitle: '' };

  return (
    <DashboardShell
      storageKey="manager_sidebar_open"
      brandTitle="Manager Console"
      roleLabel="Manager"
      navGroups={NAV_GROUPS}
      activeTab={tab}
      onTabChange={setTab}
      counts={{
        traffic: traffic?.awaiting_assignment?.length,
        active: traffic?.active_clients?.length,
      }}
      title={meta.title}
      subtitle={meta.subtitle}
      onLogout={() => { logout(); navigate('/login'); }}
    >
      {tab === 'board' && <SharedApplicationsBoard title="Shared Applications Board" />}

      {tab === 'traffic' && (
        <div>
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : !traffic ? null : (
            <>
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-3xl font-bold text-amber-600">{traffic.stats.awaiting}</p>
                  <p className="text-sm text-slate-600">Awaiting Assignment</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-3xl font-bold text-brand-700">{traffic.stats.active}</p>
                  <p className="text-sm text-slate-600">Active Clients</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-3xl font-bold text-green-600">{traffic.stats.completed}</p>
                  <p className="text-sm text-slate-600">Completed</p>
                </div>
              </div>

              <h2 className="mb-4 text-lg font-semibold text-slate-900">Forwarded Clients — Assign Consultant</h2>
              {traffic.awaiting_assignment.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                  No clients awaiting assignment.
                </div>
              ) : (
                <div className="space-y-4">
                  {traffic.awaiting_assignment.map((c) => (
                    <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{c.student_name}</p>
                          <p className="text-sm text-slate-600">{c.student_email}</p>
                          <p className="mt-1 text-sm text-brand-600">{c.plan_name}</p>
                          {c.match_percentage != null && (
                            <span className="mt-1 inline-block text-xs text-slate-500">{c.match_percentage}% match</span>
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
            </>
          )}
        </div>
      )}

      {tab === 'capacity' && (
        <div>
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(traffic?.consultants || []).map((c) => (
                <div key={c.id} className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${c.available_slots === 0 ? 'opacity-75' : ''}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.available_slots > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {c.available_slots > 0 ? 'Available' : 'Full'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{c.active_clients} active / {c.max_capacity} max</p>
                  <div className="mt-3"><ProgressBar value={c.utilization} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'active' && (
        <div>
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : !traffic?.active_clients?.length ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              No active clients.
            </div>
          ) : (
            <div className="space-y-4">
              {traffic.active_clients.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{c.student_name}</p>
                      <p className="text-sm text-slate-600">Consultant: {c.consultant_name || 'Unassigned'}</p>
                      <p className="text-sm text-brand-600">{c.plan_name}</p>
                      <div className="mt-3">
                        <div className="mb-1 flex justify-between text-xs text-slate-500">
                          <span>Milestones</span>
                          <span>{c.milestones_completed}/{c.milestones_total} ({c.progress}%)</span>
                        </div>
                        <ProgressBar value={c.progress} />
                      </div>
                      <ul className="mt-3 space-y-1">
                        {c.milestones?.map((m) => (
                          <li key={m.id} className={`flex items-center gap-2 text-xs ${m.is_completed ? 'text-green-700' : 'text-slate-500'}`}>
                            <span>{m.is_completed ? '✓' : '○'}</span>
                            {m.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      c.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>{c.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'payouts' && <PayoutsAdminPanel />}
    </DashboardShell>
  );
}
