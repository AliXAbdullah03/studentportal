'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function AdminGuidancePanel({ requests, loading, onRefresh }) {
  const [emailModal, setEmailModal] = useState(null);
  const [emailForm, setEmailForm] = useState({ subject: '', body: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const openEmail = (req) => {
    setEmailModal(req);
    setEmailForm({
      subject: `Re: Your Guidance Request — ${req.scholarship_title || 'Global Scholarships'}`,
      body: `Hi ${req.full_name},\n\nThank you for requesting guidance. We've reviewed your dossier and would like to schedule a consultation.\n\nBest regards,\nGlobal Scholarships Team`,
    });
    setError('');
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await api.messages.send({
        to_email: emailModal.email,
        to_user_id: emailModal.user_id,
        subject: emailForm.subject,
        body: emailForm.body,
      });
      setEmailModal(null);
      await api.guidance.updateStatus(emailModal.id, 'contacted');
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  if (requests.length === 0) {
    return <div className="card p-8 text-center text-gray-500">No guidance requests yet.</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {requests.map((m) => (
          <div key={m.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{m.full_name}</h3>
                  {m.match_percentage != null && (
                    <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                      {m.match_percentage}% match
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{m.email} {m.phone && `· ${m.phone}`}</p>
                {m.scholarship_title && (
                  <p className="mt-1 text-sm text-brand-600">{m.scholarship_title} — {m.university}</p>
                )}
                {m.gaps?.length > 0 && (
                  <div className="mt-3 rounded-md bg-red-50 p-3">
                    <p className="text-xs font-semibold uppercase text-red-700">Profile Gaps (Admin Only)</p>
                    <ul className="mt-1 space-y-1 text-sm text-red-800">
                      {m.gaps.map((g) => <li key={g}>• {g}</li>)}
                    </ul>
                  </div>
                )}
                {m.goals && <p className="mt-2 text-sm text-gray-500">{m.goals}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <select
                  value={m.status}
                  onChange={async (e) => {
                    await api.guidance.updateStatus(m.id, e.target.value);
                    onRefresh();
                  }}
                  className="input-field w-auto text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {m.dossier_path && (
                  <button type="button" onClick={() => api.guidance.downloadDossier(m.id)} className="btn-secondary text-xs">
                    Download PDF Dossier
                  </button>
                )}
                <button type="button" onClick={() => openEmail(m)} className="btn-primary text-xs">
                  Email Client
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {emailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={sendEmail} className="card w-full max-w-lg space-y-4 p-6">
            <h3 className="font-semibold text-gray-900">Email {emailModal.full_name}</h3>
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <div>
              <label className="label-field">To</label>
              <input disabled value={emailModal.email} className="input-field bg-gray-50" />
            </div>
            <div>
              <label className="label-field">Subject</label>
              <input required value={emailForm.subject} onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">Message</label>
              <textarea required rows={6} value={emailForm.body} onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })} className="input-field" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={sending} className="btn-primary text-sm disabled:opacity-50">Send Email</button>
              <button type="button" onClick={() => setEmailModal(null)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
