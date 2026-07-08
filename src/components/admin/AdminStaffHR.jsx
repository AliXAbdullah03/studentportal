import { useEffect, useState } from 'react';
import { api } from '../../api';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'manager', phone: '' };

export default function AdminStaffHR() {
  const [staff, setStaff] = useState([]);
  const [students, setStudents] = useState([]);
  const [subTab, setSubTab] = useState('staff');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, st] = await Promise.all([api.users.listStaff(), api.users.listStudents()]);
      setStaff(s);
      setStudents(st);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowForm(true);
  };

  const openEdit = (member) => {
    setEditingId(member.id);
    setForm({ name: member.name, email: member.email, password: '', role: member.role, phone: member.phone || '' });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        const data = { name: form.name, role: form.role, phone: form.phone };
        if (form.password) data.password = form.password;
        await api.users.updateStaff(editingId, data);
      } else {
        await api.users.createStaff(form);
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove ${name} from the system?`)) return;
    await api.users.deleteStaff(id);
    fetchData();
  };

  const toggleStatus = async (member) => {
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    await api.users.updateStaff(member.id, { status: newStatus });
    fetchData();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSubTab('staff')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${subTab === 'staff' ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Staff ({staff.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('students')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${subTab === 'students' ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Students ({students.length})
          </button>
        </div>
        {subTab === 'staff' && (
          <button type="button" onClick={openCreate} className="btn-primary text-sm">Add Staff Member</button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4 p-5">
          <h3 className="font-semibold text-gray-900">{editingId ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Full Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">Email *</label>
              <input type="email" required disabled={!!editingId} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field disabled:bg-gray-100" />
            </div>
            <div>
              <label className="label-field">Role *</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field">
                <option value="manager">Client Operations Manager</option>
                <option value="consultant">Admissions Consultant</option>
              </select>
            </div>
            <div>
              <label className="label-field">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="label-field">{editingId ? 'New Password (leave blank to keep)' : 'Password *'}</label>
              <input type="password" required={!editingId} minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm">{editingId ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : subTab === 'staff' ? (
        staff.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">No staff members yet. Add a Manager or Consultant.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staff.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                    <td className="px-4 py-3 text-gray-600">{m.email}</td>
                    <td className="px-4 py-3 capitalize text-gray-600">{m.role}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button type="button" onClick={() => openEdit(m)} className="text-brand-600 hover:text-brand-700 font-medium">Edit</button>
                      <button type="button" onClick={() => toggleStatus(m)} className="text-gray-600 hover:text-gray-800 font-medium">
                        {m.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button type="button" onClick={() => handleDelete(m.id, m.name)} className="text-red-600 hover:text-red-700 font-medium">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        students.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">No registered students yet.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Nationality</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.email}</td>
                    <td className="px-4 py-3 text-gray-600">{s.nationality || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
