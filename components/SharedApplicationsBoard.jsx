'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const COLOR_STYLES = {
  gray: {
    bg: 'bg-[#f3f4f6]',
    pill: 'bg-[#9ca3af] text-white',
    add: 'text-gray-500 hover:bg-gray-200/80',
  },
  purple: {
    bg: 'bg-[#f3e8ff]',
    pill: 'bg-[#7c3aed] text-white',
    add: 'text-[#7c3aed] hover:bg-purple-200/50',
  },
  green: {
    bg: 'bg-[#ecfdf5]',
    pill: 'bg-[#10b981] text-white',
    add: 'text-[#059669] hover:bg-emerald-200/50',
  },
  blue: {
    bg: 'bg-[#eff6ff]',
    pill: 'bg-[#2563eb] text-white',
    add: 'text-[#2563eb] hover:bg-blue-200/50',
  },
  amber: {
    bg: 'bg-[#fffbeb]',
    pill: 'bg-[#d97706] text-white',
    add: 'text-[#d97706] hover:bg-amber-200/50',
  },
  pink: {
    bg: 'bg-[#fdf2f8]',
    pill: 'bg-[#db2777] text-white',
    add: 'text-[#db2777] hover:bg-pink-200/50',
  },
  teal: {
    bg: 'bg-[#f0fdfa]',
    pill: 'bg-[#0d9488] text-white',
    add: 'text-[#0d9488] hover:bg-teal-200/50',
  },
  rose: {
    bg: 'bg-[#fff1f2]',
    pill: 'bg-[#e11d48] text-white',
    add: 'text-[#e11d48] hover:bg-rose-200/50',
  },
};

const EMPTY_APP_FORM = {
  scholarship_id: '',
  full_name: '',
  email: '',
  phone: '',
  nationality: '',
  current_education: '',
  message: '',
  board_column: 'todo',
};

function Card({ card, draggingId, onDragStart, onStatusPick, busy }) {
  const isDragging = draggingId === card.id;
  return (
    <article
      draggable={!busy}
      onDragStart={(e) => onDragStart(e, card)}
      className={`cursor-grab rounded-lg border border-white/80 bg-white p-3 shadow-sm transition active:cursor-grabbing ${
        isDragging ? 'opacity-50 ring-2 ring-violet-400' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{card.scholarship_title}</h4>
        <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-gray-500">
          #{card.id}
        </span>
      </div>
      <p className="mt-1 text-xs text-violet-700 line-clamp-1">{card.university}</p>
      <p className="mt-2 text-xs font-medium text-gray-800">{card.full_name}</p>
      <p className="text-[11px] text-gray-500 truncate">{card.email}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {card.country && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">{card.country}</span>
        )}
        {card.nationality && (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">{card.nationality}</span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-2">
        <span className="text-[10px] text-gray-400">
          {card.created_at ? new Date(card.created_at).toLocaleDateString() : ''}
        </span>
        <select
          value={card.status}
          disabled={busy}
          onChange={(e) => onStatusPick(card.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="max-w-[110px] rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium capitalize text-gray-700 outline-none focus:border-violet-400"
        >
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="in_progress">In progress</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </article>
  );
}

function ModalShell({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`w-full rounded-xl bg-white shadow-2xl ${wide ? 'max-w-lg' : 'max-w-md'}`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <button type="button" onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Close">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function SharedApplicationsBoard({ title = 'Applications Board', compact = false }) {
  const { user } = useAuth();
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draggingId, setDraggingId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [search, setSearch] = useState('');
  const [lastSync, setLastSync] = useState(null);

  const [showAddGroup, setShowAddGroup] = useState(false);
  const [groupLabel, setGroupLabel] = useState('');
  const [groupColor, setGroupColor] = useState('blue');
  const [groupSaving, setGroupSaving] = useState(false);

  const [showAddApp, setShowAddApp] = useState(false);
  const [addColumnKey, setAddColumnKey] = useState('todo');
  const [appForm, setAppForm] = useState(EMPTY_APP_FORM);
  const [scholarships, setScholarships] = useState([]);
  const [appSaving, setAppSaving] = useState(false);
  const [appError, setAppError] = useState('');

  const loadBoard = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await api.applications.board();
      setColumns(data.columns || []);
      setLastSync(data.updated_at || new Date().toISOString());
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load board');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBoard();
    const id = setInterval(() => loadBoard(true), 4000);
    return () => clearInterval(id);
  }, [loadBoard]);

  useEffect(() => {
    if (!showAddApp) return;
    api.scholarships.list({ limit: '500' })
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.scholarships || []);
        setScholarships(list);
      })
      .catch(console.error);
  }, [showAddApp]);

  const openAddApp = (columnKey) => {
    setAddColumnKey(columnKey || 'todo');
    setAppForm({ ...EMPTY_APP_FORM, board_column: columnKey || 'todo' });
    setAppError('');
    setShowAddApp(true);
  };

  const filterCards = (cards) => {
    const q = search.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter((c) =>
      [c.scholarship_title, c.university, c.full_name, c.email, c.country, c.nationality]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  };

  const handleDragStart = (e, card) => {
    setDraggingId(card.id);
    e.dataTransfer.setData('text/plain', String(card.id));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (columnKey) => {
    const id = draggingId;
    setDropTarget(null);
    setDraggingId(null);
    if (!id) return;

    const fromCol = columns.find((c) => c.cards.some((card) => card.id === id));
    if (fromCol?.key === columnKey) return;

    setBusyId(id);
    setColumns((prev) => {
      let moved = null;
      const without = prev.map((col) => {
        const found = col.cards.find((c) => c.id === id);
        if (found) moved = { ...found, board_column: columnKey };
        return { ...col, cards: col.cards.filter((c) => c.id !== id), count: col.cards.filter((c) => c.id !== id).length };
      });
      if (!moved) return prev;
      return without.map((col) => {
        if (col.key !== columnKey) return col;
        const cards = [moved, ...col.cards];
        return { ...col, cards, count: cards.length };
      });
    });

    try {
      await api.applications.moveBoard(id, { column: columnKey });
      await loadBoard(true);
    } catch (err) {
      alert(err.message);
      await loadBoard(true);
    } finally {
      setBusyId(null);
    }
  };

  const handleStatusPick = async (id, status) => {
    setBusyId(id);
    try {
      await api.applications.updateStatus(id, status);
      await loadBoard(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupLabel.trim()) return;
    setGroupSaving(true);
    try {
      await api.applications.createGroup({ label: groupLabel.trim(), color: groupColor });
      setGroupLabel('');
      setShowAddGroup(false);
      await loadBoard(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setGroupSaving(false);
    }
  };

  const handleDeleteGroup = async (key, isSystem) => {
    if (isSystem) return;
    if (!confirm('Delete this group? Cards in it will move back to TO DO.')) return;
    try {
      await api.applications.deleteGroup(key);
      await loadBoard(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateApplication = async (e) => {
    e.preventDefault();
    setAppSaving(true);
    setAppError('');
    try {
      await api.applications.submit({
        scholarship_id: parseInt(appForm.scholarship_id, 10),
        full_name: appForm.full_name.trim(),
        email: appForm.email.trim(),
        phone: appForm.phone.trim() || undefined,
        nationality: appForm.nationality.trim(),
        current_education: appForm.current_education.trim() || undefined,
        message: appForm.message.trim() || undefined,
        board_column: appForm.board_column || addColumnKey,
      });
      setShowAddApp(false);
      setAppForm(EMPTY_APP_FORM);
      await loadBoard(true);
    } catch (err) {
      setAppError(err.message || 'Could not create application');
    } finally {
      setAppSaving(false);
    }
  };

  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${compact ? '' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-violet-600 text-[10px] text-white">≡</span>
            Status
          </button>
          <div>
            <h2 className="text-sm font-bold text-gray-900">{title}</h2>
            <p className="text-[11px] text-gray-500">
              Shared live board · changes by {user?.role || 'staff'} sync for Admin, Manager & Consultant
              {lastSync && ` · synced ${new Date(lastSync).toLocaleTimeString()}`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <svg className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-40 rounded-md border border-gray-200 py-1.5 pl-8 pr-2 text-xs outline-none focus:border-violet-400"
            />
          </div>
          <button
            type="button"
            onClick={() => loadBoard()}
            className="rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={() => openAddApp('todo')}
            className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
          >
            + Application
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {loading && columns.length === 0 ? (
        <p className="p-8 text-center text-sm text-gray-500">Loading board…</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto p-4">
          {columns.map((col) => {
            const style = COLOR_STYLES[col.color] || COLOR_STYLES.gray;
            const cards = filterCards(col.cards || []);
            const isOver = dropTarget === col.key;
            return (
              <div
                key={col.key}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDropTarget(col.key);
                }}
                onDragLeave={() => setDropTarget((t) => (t === col.key ? null : t))}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(col.key);
                }}
                className={`flex w-72 shrink-0 flex-col rounded-xl ${style.bg} ${isOver ? 'ring-2 ring-violet-400 ring-offset-2' : ''}`}
              >
                <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${style.pill}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">{cards.length}</span>
                  {!col.is_system && (
                    <button
                      type="button"
                      onClick={() => handleDeleteGroup(col.key, col.is_system)}
                      className="ml-auto rounded p-1 text-[10px] text-gray-400 hover:bg-white/70 hover:text-red-500"
                      title="Delete group"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex max-h-[min(70vh,640px)] flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
                  {cards.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300/80 bg-white/40 px-3 py-8 text-center text-xs text-gray-400">
                      No applications
                    </div>
                  ) : (
                    cards.map((card) => (
                      <Card
                        key={card.id}
                        card={card}
                        draggingId={draggingId}
                        onDragStart={handleDragStart}
                        onStatusPick={handleStatusPick}
                        busy={busyId === card.id}
                      />
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openAddApp(col.key)}
                  className={`mx-2 mb-2 rounded-md px-2 py-2 text-center text-xs font-semibold transition ${style.add}`}
                >
                  + Add application
                </button>
              </div>
            );
          })}

          <div className="flex w-44 shrink-0 flex-col items-stretch gap-2 pt-3">
            {showAddGroup ? (
              <form onSubmit={handleCreateGroup} className="rounded-xl border border-violet-200 bg-violet-50/80 p-3 shadow-sm">
                <p className="mb-2 text-xs font-semibold text-violet-800">New group</p>
                <input
                  autoFocus
                  value={groupLabel}
                  onChange={(e) => setGroupLabel(e.target.value)}
                  placeholder="Group name"
                  className="mb-2 w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-violet-400"
                  required
                />
                <select
                  value={groupColor}
                  onChange={(e) => setGroupColor(e.target.value)}
                  className="mb-2 w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs outline-none"
                >
                  {Object.keys(COLOR_STYLES).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="flex gap-1">
                  <button type="submit" disabled={groupSaving} className="flex-1 rounded-md bg-violet-600 px-2 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
                    {groupSaving ? '…' : 'Add'}
                  </button>
                  <button type="button" onClick={() => { setShowAddGroup(false); setGroupLabel(''); }} className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-600">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddGroup(true)}
                className="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-500 transition hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700"
              >
                + Add group
              </button>
            )}
          </div>
        </div>
      )}

      {showAddApp && (
        <ModalShell title="Add application" onClose={() => setShowAddApp(false)} wide>
          <form onSubmit={handleCreateApplication} className="space-y-3">
            {appError && <div className="rounded-md bg-red-50 p-2 text-xs text-red-700">{appError}</div>}

            <div>
              <label className="label-field">Scholarship *</label>
              <select
                required
                value={appForm.scholarship_id}
                onChange={(e) => setAppForm({ ...appForm, scholarship_id: e.target.value })}
                className="input-field"
              >
                <option value="">Select scholarship</option>
                {scholarships.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} — {s.university}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-field">Board column</label>
              <select
                value={appForm.board_column}
                onChange={(e) => setAppForm({ ...appForm, board_column: e.target.value })}
                className="input-field"
              >
                {columns.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label-field">Full name *</label>
                <input
                  required
                  value={appForm.full_name}
                  onChange={(e) => setAppForm({ ...appForm, full_name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Email *</label>
                <input
                  type="email"
                  required
                  value={appForm.email}
                  onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label-field">Nationality *</label>
                <input
                  required
                  value={appForm.nationality}
                  onChange={(e) => setAppForm({ ...appForm, nationality: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Phone</label>
                <input
                  value={appForm.phone}
                  onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label-field">Current education</label>
              <input
                value={appForm.current_education}
                onChange={(e) => setAppForm({ ...appForm, current_education: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="label-field">Notes</label>
              <textarea
                rows={2}
                value={appForm.message}
                onChange={(e) => setAppForm({ ...appForm, message: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddApp(false)} className="btn-secondary text-sm">
                Cancel
              </button>
              <button type="submit" disabled={appSaving} className="btn-primary text-sm disabled:opacity-50">
                {appSaving ? 'Creating…' : 'Create application'}
              </button>
            </div>
          </form>
        </ModalShell>
      )}
    </div>
  );
}
