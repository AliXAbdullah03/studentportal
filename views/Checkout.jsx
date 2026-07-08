'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, formatPrice } from '@/lib/api';

export default function Checkout() {
  const { planId } = useParams();
  const { isStudent } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [order, setOrder] = useState(null);
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' });
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isStudent) return;
    api.plans.list()
      .then((plans) => {
        const p = plans.find((x) => x.id === parseInt(planId));
        if (!p) throw new Error('Plan not found');
        setPlan(p);
        return api.orders.create(p.id);
      })
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [planId, isStudent]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!order) return;
    setPaying(true);
    setError('');
    try {
      if (plan.price_cents > 0 && (!card.number || !card.expiry || !card.cvc)) {
        throw new Error('Please fill in payment details');
      }
      await api.orders.pay(order.id, {
        payment_method: plan.price_cents === 0 ? 'free' : 'card',
        card_last4: card.number.slice(-4),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  if (!isStudent) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-gray-600">Only student accounts can purchase plans.</p>
        <Link to="/plans" className="btn-primary mt-4 inline-flex">Back to Plans</Link>
      </div>
    );
  }

  if (loading) return <div className="mx-auto max-w-lg px-4 py-16 text-center">Loading checkout...</div>;

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="card p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">&#10003;</div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful</h2>
          <p className="mt-2 text-gray-600">
            You&apos;ve purchased <strong>{plan.name}</strong>. An advisor will contact you shortly.
          </p>
          <Link to="/dashboard" className="btn-primary mt-6 inline-flex">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <Link to="/plans" className="text-sm text-brand-600 hover:text-brand-700">&larr; Back to plans</Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Checkout</h1>

      {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="card mt-6 p-6">
        <h2 className="font-semibold text-gray-900">{plan?.name}</h2>
        <p className="mt-1 text-2xl font-bold text-brand-600">{formatPrice(plan?.price_cents)}</p>
        <p className="mt-2 text-sm text-gray-600">{plan?.description}</p>
      </div>

      <form onSubmit={handlePay} className="card mt-6 space-y-4 p-6">
        {plan?.price_cents > 0 ? (
          <>
            <h3 className="font-semibold text-gray-900">Payment Details</h3>
            <p className="text-xs text-gray-500">Demo checkout — no real charges. Use any card number.</p>
            <div>
              <label className="label-field">Card Number</label>
              <input
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                placeholder="4242 4242 4242 4242"
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">Expiry (MM/YY)</label>
                <input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="12/28" className="input-field" />
              </div>
              <div>
                <label className="label-field">CVC</label>
                <input value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.slice(0, 4) })} placeholder="123" className="input-field" />
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600">This plan is free — click below to confirm.</p>
        )}

        <button type="submit" disabled={paying} className="btn-primary w-full disabled:opacity-50">
          {paying ? 'Processing...' : plan?.price_cents === 0 ? 'Confirm Free Plan' : `Pay ${formatPrice(plan?.price_cents)}`}
        </button>
      </form>
    </div>
  );
}
