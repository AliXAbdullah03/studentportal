'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import AdminCommandCenter from '@/components/admin/AdminCommandCenter';
import AdminStaffHR from '@/components/admin/AdminStaffHR';
import AdminSalesPanel from '@/components/admin/AdminSalesPanel';
import AdminGuidancePanel from '@/components/admin/AdminGuidancePanel';
import SharedApplicationsBoard from '@/components/SharedApplicationsBoard';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'board', label: 'Applications Board', count: applications.length },
    { id: 'command', label: 'Command Center', count: null },
    { id: 'scholarships', label: 'Scholarships', count: scholarships.length },
    { id: 'applications', label: 'Applications List', count: applications.length },
    { id: 'mentorship', label: 'Guidance', count: mentorship.length },
    { id: 'sales', label: 'Sales & Payments', count: null },
    { id: 'hr', label: 'HR Management', count: null },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Command Center</h1>
            <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="btn-secondary text-sm">View Site</Link>
            <button type="button" onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`card p-5 text-left transition ${tab === t.id ? 'ring-2 ring-brand-600' : ''}`}
            >
              {t.count !== null && <p className="text-3xl font-bold text-brand-700">{t.count}</p>}
              <p className={`text-sm text-gray-600 ${t.count === null ? 'text-base font-semibold text-gray-900' : ''}`}>{t.label}</p>
            </button>
          ))}
        </div>

        {tab === 'board' && (
          <SharedApplicationsBoard title="Shared Applications Board" />
        )}

        {/* Command Center */}
        {tab === 'command' && (
          <AdminCommandCenter onRefresh={fetchData} />
        )}

        {/* Scholarships Tab */}
        {tab === 'scholarships' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Manage Scholarships</h2>
              <Link to="/admin/scholarships/new" className="btn-primary text-sm">Add Scholarship</Link>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : scholarships.length === 0 ? (
              <div className="card p-8 text-center text-gray-500">No scholarships yet. Add your first one!</div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Title</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">University</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Country</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {scholarships.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{s.title}</td>
                        <td className="px-4 py-3 text-gray-600">{s.university}</td>
                        <td className="px-4 py-3 text-gray-600">{s.country}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <Link to={`/admin/scholarships/${s.id}/edit`} className="text-brand-600 hover:text-brand-700 font-medium">
                            Edit
                          </Link>
                          <button type="button" onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-700 font-medium">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {tab === 'applications' && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Scholarship Applications</h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : applications.length === 0 ? (
              <div className="card p-8 text-center text-gray-500">No applications yet.</div>
            ) : (
              <div className="space-y-4">
                {applications.map((a) => (
                  <div key={a.id} className="card p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{a.full_name}</h3>
                        <p className="text-sm text-gray-600">{a.email} &middot; {a.nationality}</p>
                        <p className="mt-1 text-sm text-brand-600">{a.scholarship_title} — {a.university}</p>
                        {a.message && <p className="mt-2 text-sm text-gray-500">{a.message}</p>}
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

        {/* Guidance Tab */}
        {tab === 'mentorship' && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Guidance Requests &amp; Dossiers</h2>
            <AdminGuidancePanel requests={mentorship} loading={loading} onRefresh={fetchData} />
          </div>
        )}

        {/* Sales Tab */}
        {tab === 'sales' && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Sales &amp; Monetization</h2>
            <AdminSalesPanel />
          </div>
        )}

        {/* HR Tab */}
        {tab === 'hr' && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Human Resources</h2>
            <p className="mb-4 text-sm text-gray-600">Add, edit, and remove Managers and Admissions Consultants.</p>
            <AdminStaffHR />
          </div>
        )}
      </div>
    </div>
  );
}
