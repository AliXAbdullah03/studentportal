'use client';

import { useEffect, useState } from 'react';
import { api, formatPrice } from '@/lib/api';

export default function AdminCommandCenter({ onRefresh }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const data = await api.crm.overview();
      setOverview(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOverview(); }, []);

  const handleForward = async (id) => {
    setActionLoading(id);
    try {
      await api.crm.forward(id);
      await fetchOverview();
      onRefresh?.();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateFromOrder = async (orderId) => {
    setActionLoading(`order-${orderId}`);
    try {
      await api.crm.createAssignment({ order_id: orderId });
      await fetchOverview();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading command center...</p>;
  if (!overview) return null;

  const { stats, recentOrders, pipeline } = overview;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card border-l-4 border-l-green-500 p-5">
          <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.total_revenue_cents)}</p>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>
        <div className="card border-l-4 border-l-brand-500 p-5">
          <p className="text-2xl font-bold text-gray-900">{stats.paid_orders}</p>
          <p className="text-sm text-gray-600">Paid Orders</p>
        </div>
        <div className="card border-l-4 border-l-amber-500 p-5">
          <p className="text-2xl font-bold text-gray-900">{stats.new_clients + stats.forwarded_clients}</p>
          <p className="text-sm text-gray-600">Clients in Pipeline</p>
        </div>
        <div className="card border-l-4 border-l-purple-500 p-5">
          <p className="text-2xl font-bold text-gray-900">{stats.active_clients}</p>
          <p className="text-sm text-gray-600">Active Fulfillment</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Client Pipeline */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Client Pipeline</h3>
          {pipeline.length === 0 ? (
            <div className="card p-6 text-center text-gray-500">No clients awaiting action.</div>
          ) : (
            <div className="space-y-3">
              {pipeline.map((c) => (
                <div key={c.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{c.student_name}</p>
                      <p className="text-sm text-gray-600">{c.plan_name}</p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        c.status === 'new' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>{c.status}</span>
                    </div>
                    {c.status === 'new' && (
                      <button
                        type="button"
                        disabled={actionLoading === c.id}
                        onClick={() => handleForward(c.id)}
                        className="btn-primary text-xs whitespace-nowrap disabled:opacity-50"
                      >
                        Forward to Manager
                      </button>
                    )}
                    {c.status === 'forwarded' && (
                      <span className="text-xs font-medium text-blue-600">Awaiting assignment</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Payments */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Payments</h3>
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <div key={o.id} className="card flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">{o.student_name}</p>
                  <p className="text-sm text-gray-600">{o.plan_name} · {formatPrice(o.amount_cents)}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    o.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{o.payment_status}</span>
                  {o.payment_status === 'paid' && (
                    <button
                      type="button"
                      onClick={() => handleCreateFromOrder(o.id)}
                      disabled={actionLoading === `order-${o.id}`}
                      className="mt-1 block text-xs text-brand-600 hover:text-brand-700"
                    >
                      Ensure in pipeline
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Consultant Capacity Overview */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Team Capacity</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.consultants.map((c) => (
            <div key={c.id} className="card p-4">
              <p className="font-medium text-gray-900">{c.name}</p>
              <p className="text-sm text-gray-500">{c.active_clients} / {c.max_capacity} clients</p>
              <div className="mt-2 h-2 rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${c.utilization >= 90 ? 'bg-red-500' : c.utilization >= 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, c.utilization)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">{c.available_slots} slots available</p>
            </div>
          ))}
          {stats.consultants.length === 0 && (
            <p className="text-sm text-gray-500">No consultants added yet. Use HR Management to add staff.</p>
          )}
        </div>
      </section>
    </div>
  );
}
