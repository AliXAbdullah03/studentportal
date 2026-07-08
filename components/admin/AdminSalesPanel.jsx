'use client';

import { useEffect, useState } from 'react';
import { api, formatPrice } from '@/lib/api';

const EMPTY_PLAN = { slug: '', name: '', description: '', price_cents: 0, features: '', active: true };

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
    const data = {
      ...planForm,
      price_cents: Math.round(parseFloat(planForm.price_cents) * 100) || 0,
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
      price_cents: (plan.price_cents / 100).toFixed(2),
      features: (plan.features || []).join('\n'),
      active: plan.active,
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
                  <label className="label-field">Price (USD)</label>
                  <input type="number" step="0.01" min="0" value={planForm.price_cents} onChange={(e) => setPlanForm({ ...planForm, price_cents: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label-field">Active</label>
                  <select value={planForm.active ? '1' : '0'} onChange={(e) => setPlanForm({ ...planForm, active: e.target.value === '1' })} className="input-field">
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
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
              <div key={p.id} className="card flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold text-gray-900">{p.name} <span className="text-brand-600">{formatPrice(p.price_cents)}</span></p>
                  <p className="text-sm text-gray-500">{p.slug} · {p.active ? 'Active' : 'Inactive'}</p>
                </div>
                <button type="button" onClick={() => openEditPlan(p)} className="text-sm font-medium text-brand-600">Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
