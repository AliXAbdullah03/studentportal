'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const STATUS_STYLES = {
  scheduled: 'bg-amber-100 text-amber-800',
  live: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-slate-100 text-slate-500',
};

export default function SessionStudio({ sessionId, onBack, onChanged }) {
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(sessionId || null);
  const [session, setSession] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  const loadList = () => api.consultant.sessions().then(setSessions).catch((err) => setError(err.message));

  const loadSession = (id) => {
    if (!id) {
      setSession(null);
      return Promise.resolve();
    }
    return api.consultant.getSession(id)
      .then(setSession)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadList(), loadSession(activeId)])
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (sessionId) {
      setActiveId(sessionId);
      loadSession(sessionId);
      setShowVideo(false);
    }
  }, [sessionId]);

  const select = async (id) => {
    setActiveId(id);
    setShowVideo(false);
    setError('');
    await loadSession(id);
  };

  const updateStatus = async (status) => {
    if (!activeId) return;
    setSaving(true);
    setError('');
    try {
      const updated = await api.consultant.updateSession(activeId, { status });
      setSession(updated);
      await loadList();
      onChanged?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim() || !activeId) return;
    setSaving(true);
    try {
      const updated = await api.consultant.addSessionNote(activeId, note.trim());
      setSession(updated);
      setNote('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const upcoming = sessions.filter((s) => ['scheduled', 'live'].includes(s.status));
  const past = sessions.filter((s) => ['completed', 'cancelled'].includes(s.status));

  if (loading && !session) return <p className="text-slate-500">Loading sessions...</p>;

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {onBack && (
          <button type="button" onClick={onBack} className="mb-3 text-xs font-semibold text-brand-600">
            ← Back to calendar
          </button>
        )}
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Upcoming</h3>
        <ul className="mt-2 space-y-2">
          {upcoming.length === 0 && <li className="text-sm text-slate-400">No upcoming sessions</li>}
          {upcoming.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => select(s.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activeId === s.id ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-slate-50'
                }`}
              >
                <p className="font-medium text-slate-900 truncate">{s.title}</p>
                <p className="text-xs text-slate-500">
                  {new Date(s.starts_at).toLocaleString()}
                </p>
              </button>
            </li>
          ))}
        </ul>
        <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">Recent</h3>
        <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto">
          {past.slice(0, 12).map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => select(s.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activeId === s.id ? 'bg-slate-100' : 'hover:bg-slate-50'
                }`}
              >
                <p className="truncate text-slate-700">{s.title}</p>
                <p className="text-xs capitalize text-slate-400">{s.status}</p>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="space-y-4">
        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {!session ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Select a session to open the video studio and notes.
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{session.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {new Date(session.starts_at).toLocaleString()} – {new Date(session.ends_at).toLocaleTimeString()}
                  </p>
                  {session.student_name && (
                    <p className="mt-1 text-sm text-brand-700">{session.student_name} · {session.student_email}</p>
                  )}
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[session.status] || 'bg-slate-100'}`}>
                  {session.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {session.status === 'scheduled' && (
                  <button type="button" disabled={saving} className="btn-secondary text-sm" onClick={() => updateStatus('live')}>
                    Mark live
                  </button>
                )}
                {['scheduled', 'live'].includes(session.status) && (
                  <button type="button" disabled={saving} className="btn-primary text-sm" onClick={() => updateStatus('completed')}>
                    Mark completed
                  </button>
                )}
                {session.status !== 'cancelled' && session.status !== 'completed' && (
                  <button type="button" disabled={saving} className="btn-secondary text-sm" onClick={() => updateStatus('cancelled')}>
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  className="btn-accent text-sm"
                  onClick={() => setShowVideo((v) => !v)}
                >
                  {showVideo ? 'Hide video' : 'Join video room'}
                </button>
                {session.meeting_url && (
                  <a href={session.meeting_url} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
                    Open in new tab
                  </a>
                )}
              </div>
            </div>

            {showVideo && session.meeting_url && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm">
                <iframe
                  title="Jitsi session"
                  src={`${session.meeting_url}#userInfo.displayName="Consultant"&config.prejoinPageEnabled=false`}
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  className="h-[480px] w-full border-0"
                />
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">Session notes</h3>
              <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                {(session.notes || []).length === 0 && (
                  <p className="text-sm text-slate-500">No notes yet. Capture agenda, follow-ups, and document asks here.</p>
                )}
                {(session.notes || []).slice().reverse().map((n) => (
                  <div key={n.id || n._id || `${n.created_at}-${n.body}`} className="rounded-lg bg-slate-50 p-3">
                    <div className="flex justify-between gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{n.author_name}</span>
                      <span>{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{n.body}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={addNote} className="mt-4 space-y-2">
                <textarea
                  className="input-field"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a session note..."
                />
                <button type="submit" disabled={saving || !note.trim()} className="btn-primary text-sm disabled:opacity-50">
                  Save note
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
