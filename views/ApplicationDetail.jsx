'use client';

import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import DashboardShell from '@/components/DashboardShell';

const STATUS_LABELS = {
  pending: 'Submitted',
  reviewed: 'Under review',
  in_progress: 'Applying for you',
  accepted: 'Accepted',
  rejected: 'Not selected',
};

export default function ApplicationDetail() {
  const { id } = useParams();
  const { logout, isStudent } = useAuth();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [label, setLabel] = useState('Supporting document');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  const load = () => {
    api.applications.get(id)
      .then(setApp)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const t = setInterval(() => {
      api.applications.get(id).then(setApp).catch(() => {});
    }, 10000);
    return () => clearInterval(t);
  }, [id]);

  const handleNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setSaving(true);
    try {
      const updated = await api.applications.addNote(id, { body: note.trim() });
      setApp(updated);
      setNote('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('label', label || 'Supporting document');
      const updated = await api.applications.uploadDocument(id, fd);
      setApp(updated);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (status) => {
    setSaving(true);
    setError('');
    try {
      const updated = await api.applications.updateStatus(id, status, statusNote.trim() || undefined);
      setApp(updated);
      setStatusNote('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const content = (
    <div>
      {loading && <p className="text-slate-500">Loading application...</p>}
      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {app && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Application tracker</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">{app.scholarship_title}</h2>
                <p className="mt-1 text-sm text-brand-600">{app.university}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {[app.country, app.field_of_study, app.deadline ? `Deadline ${new Date(app.deadline).toLocaleDateString()}` : null]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                app.status === 'accepted' ? 'bg-green-100 text-green-700'
                  : app.status === 'rejected' ? 'bg-red-100 text-red-700'
                    : app.status === 'in_progress' ? 'bg-violet-100 text-violet-700'
                      : 'bg-amber-100 text-amber-700'
              }`}>
                {STATUS_LABELS[app.status] || app.status}
              </span>
            </div>
            {app.scholarship_id && (
              <Link to={`/scholarships/${app.scholarship_id}`} className="mt-4 inline-flex text-sm font-semibold text-brand-600">
                View scholarship details →
              </Link>
            )}

            {!isStudent && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Staff: update status</p>
                <input
                  className="input-field mt-2"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Optional note for the student"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {['pending', 'reviewed', 'in_progress', 'accepted', 'rejected'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={saving || app.status === s}
                      onClick={() => handleStatus(s)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize disabled:opacity-40 ${
                        app.status === s ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {STATUS_LABELS[s] || s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Progress timeline</h3>
            <ol className="mt-5 space-y-0">
              {(app.timeline || []).map((step, idx) => {
                const done = step.state === 'done' || step.state === 'accepted';
                const current = step.state === 'current';
                const failed = step.state === 'rejected';
                return (
                  <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
                    {idx < (app.timeline?.length || 0) - 1 && (
                      <span className={`absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5 ${done || current ? 'bg-brand-500' : 'bg-slate-200'}`} />
                    )}
                    <span className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      failed ? 'bg-red-500 text-white'
                        : done || current ? 'bg-brand-600 text-white'
                          : 'bg-white text-slate-400 ring-2 ring-slate-200'
                    }`}>
                      {failed ? '×' : done && !current ? '✓' : idx + 1}
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${done || current || failed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.label}
                        {step.state === 'accepted' && ' — Accepted'}
                        {step.state === 'rejected' && ' — Not selected'}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">{step.blurb}</p>
                      {step.reached_at && (
                        <p className="mt-1 text-[11px] text-slate-400">
                          {new Date(step.reached_at).toLocaleString()}
                          {step.actor_name ? ` · ${step.actor_name}` : ''}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Notes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">Updates & notes</h3>
              <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">
                {(app.notes || []).length === 0 && (
                  <p className="text-sm text-slate-500">No notes yet. Ask a question or share an update below.</p>
                )}
                {(app.notes || []).slice().reverse().map((n) => (
                  <div key={n._id || n.id || `${n.created_at}-${n.body}`} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-700">
                        {n.author_name} · <span className="capitalize text-slate-500">{n.author_role}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{n.body}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleNote} className="mt-4 space-y-2">
                <textarea
                  className="input-field"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write a note for the Scholaris team..."
                />
                <button type="submit" disabled={saving || !note.trim()} className="btn-primary text-sm disabled:opacity-50">
                  Post note
                </button>
              </form>
            </div>

            {/* Documents */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">Application documents</h3>
              <ul className="mt-4 space-y-2">
                {(app.documents || []).length === 0 && (
                  <li className="text-sm text-slate-500">No documents uploaded for this application yet.</li>
                )}
                {(app.documents || []).map((d) => (
                  <li key={d.id || d._id || d.path} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{d.label}</p>
                      <p className="text-xs text-slate-500">{d.original_name}</p>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-semibold text-brand-600"
                      onClick={() => api.applications.downloadDocument(id, d.id || d._id, d.original_name)}
                    >
                      Download
                    </button>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleUpload} className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <input
                  className="input-field"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Document label"
                />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm"
                />
                <button type="submit" disabled={saving || !file} className="btn-secondary text-sm disabled:opacity-50">
                  Upload document
                </button>
              </form>
            </div>
          </div>

          {/* History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Status history</h3>
            <ul className="mt-4 space-y-3">
              {(app.status_history || []).slice().reverse().map((h, i) => (
                <li key={h._id || h.id || i} className="flex gap-3 text-sm">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  <div>
                    <p className="font-medium text-slate-800 capitalize">
                      {h.from_status ? `${h.from_status} → ${h.to_status}` : h.to_status}
                    </p>
                    {h.note && <p className="text-slate-600">{h.note}</p>}
                    <p className="text-xs text-slate-400">
                      {h.created_at ? new Date(h.created_at).toLocaleString() : ''}
                      {h.actor_name ? ` · ${h.actor_name}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <p><strong>Applicant:</strong> {app.full_name} · {app.email}</p>
            {app.phone && <p className="mt-1"><strong>Phone:</strong> {app.phone}</p>}
            <p className="mt-1"><strong>Nationality:</strong> {app.nationality}</p>
            {app.current_education && <p className="mt-1"><strong>Education:</strong> {app.current_education}</p>}
            <p className="mt-1"><strong>Submitted:</strong> {new Date(app.created_at).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );

  if (!isStudent) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link to="/admin" className="text-sm text-brand-600">← Back</Link>
        <div className="mt-4">{content}</div>
      </div>
    );
  }

  return (
    <DashboardShell
      storageKey="student_sidebar_open"
      brandTitle="Student Portal"
      roleLabel="Student"
      navGroups={[
        {
          title: 'My account',
          items: [
            { id: 'overview', label: 'Overview', icon: 'home' },
            { id: 'progress', label: 'Scholarship Progress', icon: 'progress' },
          ],
        },
      ]}
      activeTab="progress"
      onTabChange={(tab) => {
        if (tab === 'overview') navigate('/dashboard');
        if (tab === 'progress') navigate('/dashboard');
      }}
      title="Application details"
      subtitle="Track status, notes, and documents for this scholarship"
      onLogout={() => { logout(); navigate('/'); }}
      headerActions={(
        <Link to="/dashboard" className="btn-secondary shrink-0 text-sm">All applications</Link>
      )}
    >
      {content}
    </DashboardShell>
  );
}
