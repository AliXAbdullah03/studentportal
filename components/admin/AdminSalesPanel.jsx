'use client';

import { useEffect, useState } from 'react';
import { api, formatPrice } from '@/lib/api';

const EMPTY_PLAN = {
  slug: '',
  name: '',
  description: '',
  price_cents: '',
  features: '',
  active: true,
  category: 'research',
  plan_type: '',
  difficulty: '',
  currency: 'PKR',
  payment_type: 'retainer',
  milestone_1_cents: '',
  milestone_2_cents: '',
  payment_note: '',
  internal_split: '',
  sort_order: 0,
};

export default function AdminSalesPanel() {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planForm, setPlanForm] = useState(EMPTY_PLAN);
  const [editingPlanId, setEditingPlanId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [o, p] = await Promise.all([api.orders.list(), api.plans.adminAll()]);
      setOrders(o);
      setPlans(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    const toCents = (v) => (v === '' || v == null ? null : Math.round(parseFloat(v) * 100) || 0);
    const data = {
      ...planForm,
      price_cents: Math.round(parseFloat(planForm.price_cents) * 100) || 0,
      milestone_1_cents: toCents(planForm.milestone_1_cents),
      milestone_2_cents: toCents(planForm.milestone_2_cents),
      sort_order: Number(planForm.sort_order) || 0,
      features: planForm.features.split('\n').filter(Boolean),
    };
    if (editingPlanId) {
      await api.plans.update(editingPlanId, data);
    } else {
      await api.plans.create(data);
    }
    setShowPlanForm(false);
    setPlanForm(EMPTY_PLAN);
    setEditingPlanId(null);
    fetchData();
  };

  const openEditPlan = (plan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      slug: plan.slug,
      name: plan.name,
      description: plan.description || '',
      price_cents: ((plan.price_cents || 0) / 100).toFixed(0),
      features: (plan.features || []).join('\n'),
      active: plan.active,
      category: plan.category || 'other',
      plan_type: plan.plan_type || '',
      difficulty: plan.difficulty || '',
      currency: plan.currency || 'PKR',
      payment_type: plan.payment_type || 'retainer',
      milestone_1_cents: plan.milestone_1_cents != null ? String(plan.milestone_1_cents / 100) : '',
      milestone_2_cents: plan.milestone_2_cents != null ? String(plan.milestone_2_cents / 100) : '',
      payment_note: plan.payment_note || '',
      internal_split: plan.internal_split || '',
      sort_order: plan.sort_order || 0,
    });
    setShowPlanForm(true);
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button type="button" onClick={() => setTab('orders')} className={`rounded-md px-3 py-1.5 text-sm font-medium ${tab === 'orders' ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          Payments ({orders.length})
        </button>
        <button type="button" onClick={() => setTab('plans')} className={`rounded-md px-3 py-1.5 text-sm font-medium ${tab === 'plans' ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          Service Plans ({plans.length})
        </button>
      </div>

      {tab === 'orders' && (
        <div>
          {loading ? <p className="text-gray-500">Loading...</p> : orders.length === 0 ? (
            <div className="card p-8 text-center text-gray-500">No orders yet.</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Student</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Plan</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Transaction</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{o.student_name}</p>
                        <p className="text-xs text-gray-500">{o.student_email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{o.plan_name}</td>
                      <td className="px-4 py-3 font-medium">{formatPrice(o.amount_cents)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={o.payment_status}
                          onChange={async (e) => {
                            await api.orders.updateStatus(o.id, e.target.value);
                            fetchData();
                          }}
                          className="input-field w-auto text-xs capitalize"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{o.transaction_id || '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'plans' && (
        <div>
          <div className="mb-4 flex justify-end">
            <button type="button" onClick={() => { setShowPlanForm(true); setEditingPlanId(null); setPlanForm(EMPTY_PLAN); }} className="btn-primary text-sm">
              Add Plan
            </button>
          </div>

          {showPlanForm && (
            <form onSubmit={handlePlanSubmit} className="card mb-6 space-y-4 p-5">
              <h3 className="font-semibold">{editingPlanId ? 'Edit Plan' : 'New Plan'}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-field">Slug</label>
                  <input required disabled={!!editingPlanId} value={planForm.slug} onChange={(e) => setPlanForm({ ...planForm, slug: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label-field">Name</label>
                  <input required value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label-field">Price (PKR)</label>
                  <input type="number" step="1" min="0" value={planForm.price_cents} onChange={(e) => setPlanForm({ ...planForm, price_cents: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label-field">Category</label>
                  <select value={planForm.category} onChange={(e) => setPlanForm({ ...planForm, category: e.target.value })} className="input-field">
                    <option value="research">Research / PhD</option>
                    <option value="private">Private University</option>
                    <option value="government">Government</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label-field">Payment Type</label>
                  <select value={planForm.payment_type} onChange={(e) => setPlanForm({ ...planForm, payment_type: e.target.value })} className="input-field">
                    <option value="upfront">Upfront</option>
                    <option value="milestone">Milestone</option>
                    <option value="retainer">Retainer 60/40</option>
                    <option value="free">Free</option>
                  </select>
                </div>
                <div>
                  <label className="label-field">Active</label>
                  <select value={planForm.active ? '1' : '0'} onChange={(e) => setPlanForm({ ...planForm, active: e.target.value === '1' })} className="input-field">
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="label-field">Plan Type Label</label>
                  <input value={planForm.plan_type} onChange={(e) => setPlanForm({ ...planForm, plan_type: e.target.value })} className="input-field" placeholder="e.g. Tier 3 / Bespoke" />
                </div>
                <div>
                  <label className="label-field">Difficulty</label>
                  <select value={planForm.difficulty} onChange={(e) => setPlanForm({ ...planForm, difficulty: e.target.value })} className="input-field">
                    <option value="">—</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="label-field">Milestone 1 (PKR)</label>
                  <input type="number" value={planForm.milestone_1_cents} onChange={(e) => setPlanForm({ ...planForm, milestone_1_cents: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label-field">Milestone 2 (PKR)</label>
                  <input type="number" value={planForm.milestone_2_cents} onChange={(e) => setPlanForm({ ...planForm, milestone_2_cents: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="label-field">Payment Note</label>
                <input value={planForm.payment_note} onChange={(e) => setPlanForm({ ...planForm, payment_note: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="label-field">Internal Split (admin only)</label>
                <input value={planForm.internal_split} onChange={(e) => setPlanForm({ ...planForm, internal_split: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="label-field">Description</label>
                <input value={planForm.description} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="label-field">Features (one per line)</label>
                <textarea rows={4} value={planForm.features} onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })} className="input-field" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary text-sm">Save</button>
                <button type="button" onClick={() => setShowPlanForm(false)} className="btn-secondary text-sm">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {plans.map((p) => (
              <div key={p.id} className="card flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {p.name}{' '}
                    <span className="text-brand-600">{formatPrice(p.price_cents, p.currency)}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {p.category} · {p.slug} · {p.payment_type} · {p.active ? 'Active' : 'Inactive'}
                  </p>
                  {p.internal_split && (
                    <p className="mt-1 text-xs text-amber-700">Split: {p.internal_split}</p>
                  )}
                </div>
                <button type="button" onClick={() => openEditPlan(p)} className="shrink-0 text-sm font-medium text-brand-600">Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
