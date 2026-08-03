'use client';

import { useEffect, useState } from 'react';
import { api, formatPrice } from '@/lib/api';

export default function PayoutsAdminPanel() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('requested');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    const params = filter === 'all' ? {} : { status: filter };
    api.consultant.payouts(params)
      .then(setRows)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const process = async (id, status) => {
    setBusy(id);
    setError('');
    try {
      await api.consultant.processPayout(id, { status });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {['requested', 'approved', 'paid', 'rejected', 'all'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <p className="text-slate-500">Loading payouts...</p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No payouts in this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((p) => (
            <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{p.consultant_name || 'Consultant'}</p>
                  <p className="text-sm text-slate-500">{p.consultant_email}</p>
                  <p className="mt-1 text-lg font-bold text-brand-700">{formatPrice(p.amount_cents)}</p>
                  {p.note && <p className="mt-1 text-xs text-slate-500">Note: {p.note}</p>}
                  <p className="mt-1 text-xs text-slate-400">{new Date(p.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-700">
                    {p.status}
                  </span>
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    {p.status === 'requested' && (
                      <>
                        <button type="button" disabled={busy === p.id} className="btn-secondary text-xs" onClick={() => process(p.id, 'approved')}>
                          Approve
                        </button>
                        <button type="button" disabled={busy === p.id} className="btn-primary text-xs" onClick={() => process(p.id, 'paid')}>
                          Mark paid
                        </button>
                        <button type="button" disabled={busy === p.id} className="text-xs font-semibold text-red-600" onClick={() => process(p.id, 'rejected')}>
                          Reject
                        </button>
                      </>
                    )}
                    {p.status === 'approved' && (
                      <button type="button" disabled={busy === p.id} className="btn-primary text-xs" onClick={() => process(p.id, 'paid')}>
                        Mark paid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
