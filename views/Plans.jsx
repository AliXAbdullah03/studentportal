'use client';

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, formatPrice, PLAN_CATEGORY_META } from '@/lib/api';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('research');
  const { isAuth, isStudent } = useAuth();

  useEffect(() => {
    api.plans.list().then(setPlans).catch(console.error).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const present = new Set(plans.map((p) => p.category || 'other'));
    return PLAN_CATEGORY_META.filter((c) => present.has(c.id));
  }, [plans]);

  useEffect(() => {
    if (categories.length && !categories.some((c) => c.id === category)) {
      setCategory(categories[0].id);
    }
  }, [categories, category]);

  const filtered = plans.filter((p) => (p.category || 'other') === category);
  const meta = PLAN_CATEGORY_META.find((c) => c.id === category);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">Scholaris 2026–27</p>
          <h1 className="mt-2 text-4xl font-bold">Service Plans &amp; Fee Structure</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
            Official consultancy packages for research, postgraduate, and undergraduate placement — priced in PKR.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium transition ${
                  category === c.id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {meta && (
            <div className="mb-8 max-w-3xl">
              <h2 className="text-2xl font-bold text-gray-900">{meta.label}</h2>
              <p className="mt-2 text-gray-600">{meta.blurb}</p>
              {category === 'undergraduate' && (
                <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  Undergraduate services are for admission placement only. Scholarships and financial aid are not guaranteed.
                </p>
              )}
              {category === 'government' && (
                <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  Government schemes involve more paperwork, multiple portals, and 4–12 month timelines — pricing reflects that complexity.
                </p>
              )}
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500">Loading plans...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500">No plans in this category yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((plan) => (
                <PlanCard key={plan.id} plan={plan} isAuth={isAuth} isStudent={isStudent} />
              ))}
            </div>
          )}

          <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
            <h3 className="font-semibold text-gray-900">Standard policies</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>60% advance on registration · 40% before first portal submission (retainer plans)</li>
              <li>Client provides LORs and completes required language / entrance tests</li>
              <li>Applications enter the execution queue only after documents are uploaded</li>
              <li>Fees are non-refundable once a service phase has commenced</li>
              <li>Scholaris does not guarantee admission, funding, or visa approval</li>
            </ul>
            <Link to="/policies" className="mt-3 inline-block font-semibold text-brand-600 hover:text-brand-700">
              Read full policies &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PlanCard({ plan, isAuth, isStudent }) {
  const navigate = useNavigate();
  const currency = plan.currency || 'PKR';

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
    <div className="card flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        {plan.plan_type && (
          <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">{plan.plan_type}</span>
        )}
        {plan.difficulty && (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-600">{plan.difficulty}</span>
        )}
      </div>
      <h3 className="mt-3 text-lg font-bold text-gray-900">{plan.name}</h3>
      <p className="mt-2 text-2xl font-bold text-brand-600">{formatPrice(plan.price_cents, currency)}</p>
      {plan.payment_note && <p className="mt-1 text-xs text-gray-500">{plan.payment_note}</p>}
      {plan.payment_type === 'milestone' && plan.milestone_1_cents != null && (
        <p className="mt-1 text-xs text-gray-500">
          Due now: {formatPrice(plan.milestone_1_cents, currency)}
          {plan.milestone_2_cents != null && ` · Later: ${formatPrice(plan.milestone_2_cents, currency)}`}
        </p>
      )}
      {plan.description && <p className="mt-2 text-sm text-gray-600">{plan.description}</p>}
      <ul className="mt-4 flex-1 space-y-2">
        {(plan.features || []).slice(0, 6).map((f) => (
          <li key={f} className="flex gap-2 text-sm text-gray-600">
            <span className="text-green-500">&#10003;</span> {f}
          </li>
        ))}
        {(plan.features || []).length > 6 && (
          <li className="text-xs text-gray-400">+{(plan.features || []).length - 6} more inclusions</li>
        )}
      </ul>
      <button type="button" onClick={handleSelect} className="btn-primary mt-6 w-full">
        {plan.price_cents === 0 ? 'Get Started' : 'Select Plan'}
      </button>
    </div>
  );
}
