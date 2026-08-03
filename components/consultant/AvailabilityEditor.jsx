'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function emptyWeekly() {
  return DAY_LABELS.map((_, day) => ({
    day,
    start: day >= 1 && day <= 5 ? '10:00' : '09:00',
    end: day >= 1 && day <= 5 ? '16:00' : '17:00',
    enabled: day >= 1 && day <= 5,
  }));
}

export default function AvailabilityEditor() {
  const [timezone, setTimezone] = useState('Asia/Karachi');
  const [weekly, setWeekly] = useState(emptyWeekly());
  const [overrides, setOverrides] = useState([]);
  const [blockDate, setBlockDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.consultant.getAvailability()
      .then((data) => {
        setTimezone(data.timezone || 'Asia/Karachi');
        const byDay = emptyWeekly();
        (data.weekly || []).forEach((r) => {
          const idx = Number(r.day);
          if (idx >= 0 && idx <= 6) byDay[idx] = { ...byDay[idx], ...r, day: idx };
        });
        setWeekly(byDay);
        setOverrides(data.overrides || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const updateDay = (day, patch) => {
    setWeekly((prev) => prev.map((r) => (r.day === day ? { ...r, ...patch } : r)));
  };

  const addBlock = () => {
    if (!blockDate) return;
    if (overrides.some((o) => o.date === blockDate)) return;
    setOverrides((prev) => [...prev, { date: blockDate, blocked: true }]);
    setBlockDate('');
  };

  const removeOverride = (date) => {
    setOverrides((prev) => prev.filter((o) => o.date !== date));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await api.consultant.saveAvailability({ timezone, weekly, overrides });
      setMessage('Availability saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-slate-500">Loading availability...</p>;

  return (
    <div className="space-y-6">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="label-field">Timezone</label>
        <select className="input-field max-w-sm" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          <option value="Asia/Karachi">Asia/Karachi</option>
          <option value="Asia/Dubai">Asia/Dubai</option>
          <option value="Europe/London">Europe/London</option>
          <option value="America/New_York">America/New_York</option>
          <option value="UTC">UTC</option>
        </select>
        <p className="mt-2 text-xs text-slate-500">Weekly hours and session slots use this timezone.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900">Weekly hours</h3>
        <div className="mt-4 space-y-3">
          {weekly.map((r) => (
            <div key={r.day} className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-100 px-3 py-2">
              <label className="flex w-36 items-center gap-2 text-sm font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={!!r.enabled}
                  onChange={(e) => updateDay(r.day, { enabled: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600"
                />
                {DAY_LABELS[r.day]}
              </label>
              <input
                type="time"
                disabled={!r.enabled}
                value={r.start}
                onChange={(e) => updateDay(r.day, { start: e.target.value })}
                className="input-field w-auto disabled:opacity-40"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="time"
                disabled={!r.enabled}
                value={r.end}
                onChange={(e) => updateDay(r.day, { end: e.target.value })}
                className="input-field w-auto disabled:opacity-40"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900">Blocked dates</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <input type="date" className="input-field w-auto" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} />
          <button type="button" onClick={addBlock} className="btn-secondary text-sm">Block date</button>
        </div>
        {overrides.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No blocked dates.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {overrides.map((o) => (
              <li key={o.date} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span>{o.date}{o.blocked ? ' · fully blocked' : ''}</span>
                <button type="button" className="text-xs font-semibold text-red-600" onClick={() => removeOverride(o.date)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="button" disabled={saving} onClick={handleSave} className="btn-primary disabled:opacity-50">
        {saving ? 'Saving...' : 'Save availability'}
      </button>
    </div>
  );
}
