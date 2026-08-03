'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

function startOfWeek(d) {
  const x = new Date(d);
  const day = x.getDay();
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function fmtDay(d) {
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function toLocalInputValue(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ConsultantCalendar({ clients = [], onOpenSession, initialAssignmentId }) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [sessions, setSessions] = useState([]);
  const [freeSlots, setFreeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(!!initialAssignmentId);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: 'Consultation session',
    starts_at: '',
    ends_at: '',
    assignment_id: initialAssignmentId || '',
  });

  const from = weekStart.toISOString();
  const to = addDays(weekStart, 7).toISOString();
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const load = () => {
    setLoading(true);
    api.consultant.calendar(from, to)
      .then((data) => {
        setSessions(data.sessions || []);
        setFreeSlots(data.free_slots || []);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [from, to]);

  useEffect(() => {
    if (initialAssignmentId) {
      setForm((f) => ({ ...f, assignment_id: initialAssignmentId }));
      setShowForm(true);
    }
  }, [initialAssignmentId]);

  const sessionsByDay = (day) => {
    const key = day.toDateString();
    return sessions.filter((s) => new Date(s.starts_at).toDateString() === key);
  };

  const pickSlot = (slot) => {
    setForm((f) => ({
      ...f,
      starts_at: toLocalInputValue(slot.starts_at),
      ends_at: toLocalInputValue(slot.ends_at),
    }));
    setShowForm(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.consultant.createSession({
        title: form.title.trim(),
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: new Date(form.ends_at).toISOString(),
        assignment_id: form.assignment_id || undefined,
      });
      setShowForm(false);
      setForm({ title: 'Consultation session', starts_at: '', ends_at: '', assignment_id: '' });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelSession = async (id) => {
    if (!confirm('Cancel this session?')) return;
    try {
      await api.consultant.updateSession(id, { status: 'cancelled' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button type="button" className="btn-secondary text-sm" onClick={() => setWeekStart(addDays(weekStart, -7))}>
            ← Prev
          </button>
          <button type="button" className="btn-secondary text-sm" onClick={() => setWeekStart(startOfWeek(new Date()))}>
            Today
          </button>
          <button type="button" className="btn-secondary text-sm" onClick={() => setWeekStart(addDays(weekStart, 7))}>
            Next →
          </button>
          <p className="ml-2 text-sm font-medium text-slate-700">
            Week of {fmtDay(weekStart)}
          </p>
        </div>
        <button type="button" className="btn-primary text-sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Close form' : 'Book session'}
        </button>
      </div>

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-slate-900">Schedule a session</h3>
          <div>
            <label className="label-field">Title</label>
            <input className="input-field" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label-field">Starts</label>
              <input type="datetime-local" required className="input-field" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Ends</label>
              <input type="datetime-local" required className="input-field" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label-field">Client (optional)</label>
            <select className="input-field" value={form.assignment_id} onChange={(e) => setForm({ ...form, assignment_id: e.target.value })}>
              <option value="">No linked client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.student_name} · {c.plan_name}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
            {saving ? 'Creating...' : 'Create session'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-slate-500">Loading calendar...</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-7">
          {days.map((day) => {
            const daySessions = sessionsByDay(day);
            const dayKey = day.toISOString().slice(0, 10);
            const daySlots = freeSlots.filter((s) => s.date === dayKey).slice(0, 4);
            return (
              <div key={day.toISOString()} className="min-h-[180px] rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-xs font-semibold text-slate-700">{fmtDay(day)}</p>
                <div className="mt-2 space-y-2">
                  {daySessions.map((s) => (
                    <div key={s.id} className={`rounded-lg px-2 py-1.5 text-[11px] ${
                      s.status === 'cancelled' ? 'bg-slate-100 text-slate-400 line-through'
                        : s.status === 'completed' ? 'bg-green-50 text-green-800'
                          : 'bg-brand-50 text-brand-900'
                    }`}>
                      <p className="font-semibold">{new Date(s.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="truncate">{s.title}</p>
                      {s.student_name && <p className="truncate text-slate-500">{s.student_name}</p>}
                      {s.status !== 'cancelled' && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          <button type="button" className="font-semibold text-brand-700" onClick={() => onOpenSession?.(s.id)}>
                            Open
                          </button>
                          {s.status !== 'completed' && (
                            <button type="button" className="font-semibold text-red-600" onClick={() => cancelSession(s.id)}>
                              Cancel
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {daySessions.length === 0 && daySlots.length === 0 && (
                    <p className="text-[11px] text-slate-400">No sessions</p>
                  )}
                  {daySlots.map((slot) => (
                    <button
                      key={slot.starts_at}
                      type="button"
                      onClick={() => pickSlot(slot)}
                      className="block w-full rounded border border-dashed border-slate-200 px-2 py-1 text-left text-[10px] text-slate-500 hover:border-brand-300 hover:text-brand-700"
                    >
                      Free {new Date(slot.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
