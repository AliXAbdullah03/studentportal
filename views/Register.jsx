'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { getPostAuthPath } from '@/lib/api';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', nationality: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, openAuthModal, isAuth, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (isAuth && user) {
      navigate(getPostAuthPath(user), { replace: true });
      return;
    }
    try { sessionStorage.setItem('auth_modal_seen', '1'); } catch { /* ignore */ }
    openAuthModal('register');
    navigate('/', { replace: true });
  }, [authLoading, isAuth, user, navigate, openAuthModal]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const created = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        nationality: form.nationality || undefined,
      });
      navigate(getPostAuthPath(created));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
            GS
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Student Registration</h1>
          <p className="mt-1 text-sm text-gray-500">Opening registration…</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <div>
            <label htmlFor="name" className="label-field">Full Name *</label>
            <input id="name" name="name" required value={form.name} onChange={handleChange} className="input-field" />
          </div>

          <div>
            <label htmlFor="email" className="label-field">Email *</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="input-field" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="label-field">Password *</label>
              <input id="password" name="password" type="password" required minLength={6} value={form.password} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="label-field">Confirm *</label>
              <input id="confirmPassword" name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="label-field">Phone</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="input-field" />
          </div>

          <div>
            <label htmlFor="nationality" className="label-field">Nationality</label>
            <input id="nationality" name="nationality" value={form.nationality} onChange={handleChange} className="input-field" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
