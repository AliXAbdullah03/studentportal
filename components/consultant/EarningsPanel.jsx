'use client';

import { useEffect, useState } from 'react';
import { api, formatPrice } from '@/lib/api';

export default function EarningsPanel() {
  const [earnings, setEarnings] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([api.consultant.earnings(), api.consultant.payouts()])
      .then(([e, p]) => {
        setEarnings(e);
        setPayouts(p);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const requestPayout = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const rupees = Number(amount);
      if (!rupees || rupees <= 0) throw new Error('Enter a valid amount in PKR');
      const amount_cents = Math.round(rupees * 100);
      await api.consultant.requestPayout({ amount_cents, note: note.trim() || undefined });
      setAmount('');
      setNote('');
      setMessage('Payout requested. Manager/Admin will process it.');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !earnings) return <p className="text-slate-500">Loading earnings...</p>;

  const available = earnings?.available_cents || 0;

  return (
    <div className="space-y-6">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-brand-700">{formatPrice(available)}</p>
          <p className="text-sm text-slate-600">Available to withdraw</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-amber-600">{formatPrice(earnings?.pending_cents || 0)}</p>
          <p className="text-sm text-slate-600">In payout review</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{formatPrice(earnings?.paid_cents || 0)}</p>
          <p className="text-sm text-slate-600">Paid out</p>
        </div>
      </div>

      <form onSubmit={requestPayout} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <h3 className="font-semibold text-slate-900">Request payout</h3>
        <p className="text-xs text-slate-500">
          Credits: Rs. 2,000 per completed milestone · Rs. 3,000 per completed session.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label-field">Amount (PKR)</label>
            <input
              type="number"
              min="1"
              step="1"
              className="input-field"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={String(Math.floor(available / 100) || '')}
            />
          </div>
          <div>
            <label className="label-field">Note (optional)</label>
            <input className="input-field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Bank / JazzCash details..." />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={saving || available <= 0} className="btn-primary text-sm disabled:opacity-50">
            {saving ? 'Submitting...' : 'Request payout'}
          </button>
          <button
            type="button"
            className="btn-secondary text-sm"
            disabled={available <= 0}
            onClick={() => setAmount(String(Math.floor(available / 100)))}
          >
            Use full balance
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900">Payout requests</h3>
        {payouts.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No payout requests yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {payouts.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-900">{formatPrice(p.amount_cents)}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(p.created_at).toLocaleString()}
                    {p.note ? ` · ${p.note}` : ''}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-700">
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900">Earnings ledger</h3>
        {(earnings?.entries || []).length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Complete milestones or sessions to earn credits.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Description</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {earnings.entries.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2 pr-4 text-xs text-slate-500 whitespace-nowrap">
                      {e.created_at ? new Date(e.created_at).toLocaleDateString() : ''}
                    </td>
                    <td className="py-2 pr-4 text-slate-800">{e.description || e.source}</td>
                    <td className="py-2 pr-4 font-medium text-slate-900">{formatPrice(e.amount_cents)}</td>
                    <td className="py-2 capitalize text-slate-600">{e.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
