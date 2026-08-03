'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import DashboardShell from '@/components/DashboardShell';
import AdminCommandCenter from '@/components/admin/AdminCommandCenter';
import AdminStaffHR from '@/components/admin/AdminStaffHR';
import AdminSalesPanel from '@/components/admin/AdminSalesPanel';
import AdminGuidancePanel from '@/components/admin/AdminGuidancePanel';
import SharedApplicationsBoard from '@/components/SharedApplicationsBoard';
import PayoutsAdminPanel from '@/components/consultant/PayoutsAdminPanel';

const NAV_GROUPS = [
  {
    title: 'Operations',
    items: [
      { id: 'board', label: 'Applications Board', icon: 'board' },
      { id: 'applications', label: 'Applications List', icon: 'list' },
      { id: 'command', label: 'Command Center', icon: 'command' },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { id: 'scholarships', label: 'Scholarships', icon: 'book' },
    ],
  },
  {
    title: 'Services',
    items: [
      { id: 'mentorship', label: 'Guidance', icon: 'guidance' },
      { id: 'sales', label: 'Sales & Payments', icon: 'sales' },
      { id: 'payouts', label: 'Consultant Payouts', icon: 'sales' },
    ],
  },
  {
    title: 'Organization',
    items: [
      { id: 'hr', label: 'HR Management', icon: 'hr' },
    ],
  },
];

const TAB_META = {
  board: { title: 'Applications Board', subtitle: 'Shared live board for Admin, Manager & Consultant' },
  command: { title: 'Command Center', subtitle: 'Pipeline overview, KPIs, and client forwarding' },
  scholarships: { title: 'Scholarships', subtitle: 'Create, edit, and manage catalog listings' },
  applications: { title: 'Applications List', subtitle: 'Review submissions and update status' },
  mentorship: { title: 'Guidance', subtitle: 'Requests, match dossiers, and follow-ups' },
  sales: { title: 'Sales & Payments', subtitle: 'Plans, orders, and monetization' },
  payouts: { title: 'Consultant Payouts', subtitle: 'Approve and mark consultant payout requests as paid' },
  hr: { title: 'HR Management', subtitle: 'Managers and admissions consultants' },
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('board');
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [mentorship, setMentorship] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, g] = await Promise.all([
        api.scholarships.adminAll(),
        api.guidance.list(),
      ]);
      setScholarships(s);
      setApplications(await api.applications.list());
      setMentorship(g);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this scholarship?')) return;
    await api.scholarships.delete(id);
    fetchData();
  };

  const meta = TAB_META[tab] || { title: 'Admin', subtitle: '' };

  return (
    <DashboardShell
      storageKey="admin_sidebar_open"
      brandTitle="Admin Settings"
      roleLabel="Admin"
      navGroups={NAV_GROUPS}
      activeTab={tab}
      onTabChange={setTab}
      counts={{
        board: applications.length,
        applications: applications.length,
        scholarships: scholarships.length,
        mentorship: mentorship.length,
      }}
      title={meta.title}
      subtitle={meta.subtitle}
      onLogout={() => { logout(); navigate('/login'); }}
      headerActions={tab === 'scholarships' ? (
        <Link to="/admin/scholarships/new" className="btn-primary shrink-0 text-sm">Add Scholarship</Link>
      ) : null}
    >
      {tab === 'board' && <SharedApplicationsBoard title="Shared Applications Board" />}
      {tab === 'command' && <AdminCommandCenter onRefresh={fetchData} />}

      {tab === 'scholarships' && (
        <div>
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : scholarships.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No scholarships yet. Add your first one!
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-500">Title</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-500">University</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-500">Country</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                      <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scholarships.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-medium text-slate-900">{s.title}</td>
                        <td className="px-4 py-3 text-slate-600">{s.university}</td>
                        <td className="px-4 py-3 text-slate-600">{s.country}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                          }`}>{s.status}</span>
                        </td>
                        <td className="space-x-3 px-4 py-3 text-right">
                          <Link to={`/admin/scholarships/${s.id}/edit`} className="font-medium text-brand-600 hover:text-brand-700">Edit</Link>
                          <button type="button" onClick={() => handleDelete(s.id)} className="font-medium text-red-600 hover:text-red-700">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'applications' && (
        <div>
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : applications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No applications yet.</div>
          ) : (
            <div className="space-y-3">
              {applications.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{a.full_name}</h3>
                      <p className="text-sm text-slate-600">{a.email} · {a.nationality}</p>
                      <p className="mt-1 text-sm text-brand-600">{a.scholarship_title} — {a.university}</p>
                      {a.message && <p className="mt-2 text-sm text-slate-500">{a.message}</p>}
                    </div>
                    <select
                      value={a.status}
                      onChange={async (e) => {
                        await api.applications.updateStatus(a.id, e.target.value);
                        fetchData();
                      }}
                      className="input-field w-auto text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="in_progress">In progress</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'mentorship' && (
        <AdminGuidancePanel requests={mentorship} loading={loading} onRefresh={fetchData} />
      )}
      {tab === 'sales' && <AdminSalesPanel />}
      {tab === 'payouts' && <PayoutsAdminPanel />}
      {tab === 'hr' && (
        <div>
          <p className="mb-4 text-sm text-slate-600">Add, edit, and remove Managers and Admissions Consultants.</p>
          <AdminStaffHR />
        </div>
      )}
    </DashboardShell>
  );
}
