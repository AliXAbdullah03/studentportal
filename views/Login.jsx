'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';
import { getPostAuthPath } from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, openAuthModal, isAuth, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (isAuth && user) {
      navigate(getPostAuthPath(user), { replace: true });
      return;
    }
    try { sessionStorage.setItem('auth_modal_seen', '1'); } catch { /* ignore */ }
    openAuthModal('login');
    navigate('/', { replace: true });
  }, [authLoading, isAuth, user, navigate, openAuthModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loggedIn = await login(email, password);
      navigate(getPostAuthPath(loggedIn));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
            GS
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Sign In</h1>
          <p className="mt-1 text-sm text-gray-500">Opening sign-in…</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5 p-6">
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <div>
            <label htmlFor="email" className="label-field">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
          </div>

          <div>
            <label htmlFor="password" className="label-field">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-600">
            New student?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
