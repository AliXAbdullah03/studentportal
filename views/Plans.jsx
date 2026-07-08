'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, formatPrice } from '@/lib/api';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuth, isStudent } = useAuth();

  useEffect(() => {
    api.plans.list().then(setPlans).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Service Plans</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
            Choose a mentorship package to get expert help with your scholarship applications.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-gray-500">Loading plans...</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {plans.map((plan, i) => (
                <PlanCard key={plan.id} plan={plan} popular={i === 1} isAuth={isAuth} isStudent={isStudent} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PlanCard({ plan, popular, isAuth, isStudent }) {
  const navigate = useNavigate();

  const handleSelect = () => {
    if (!isAuth) {
      navigate(`/login?redirect=/checkout/${plan.id}`);
      return;
    }
    if (!isStudent) {
      alert('Only students can purchase plans.');
      return;
    }
    navigate(`/checkout/${plan.id}`);
  };

  return (
    <div className={`card relative p-6 ${popular ? 'ring-2 ring-brand-600' : ''}`}>
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
      <p className="mt-2 text-2xl font-bold text-brand-600">{formatPrice(plan.price_cents)}</p>
      {plan.description && <p className="mt-2 text-sm text-gray-600">{plan.description}</p>}
      <ul className="mt-4 space-y-2">
        {(plan.features || []).map((f) => (
          <li key={f} className="flex gap-2 text-sm text-gray-600">
            <span className="text-green-500">&#10003;</span> {f}
          </li>
        ))}
      </ul>
      <button type="button" onClick={handleSelect} className={`mt-6 w-full ${popular ? 'btn-primary' : 'btn-secondary'}`}>
        {plan.price_cents === 0 ? 'Get Started' : 'Purchase Plan'}
      </button>
    </div>
  );
}
