'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getPostAuthPath } from '@/lib/api';
import { useNavigate } from '@/lib/navigation';

const EXPLORE_SLIDES = [
  {
    title: 'Explore →',
    caption: '+1,000 PhD scholarships',
    bullets: [
      'Discover fully funded doctoral programs worldwide',
      'Use our match test to find scholarships that fit you',
      'Eligibility, benefits, deadlines and expert guidance',
    ],
  },
  {
    title: 'Match →',
    caption: 'Free profile match %',
    bullets: [
      'Test your competitiveness before you apply',
      'See gaps that lower your chances',
      'Unlock full details when you create an account',
    ],
  },
  {
    title: 'Guidance →',
    caption: 'Expert PhD consultants',
    bullets: [
      'Personal dossiers and application review',
      'Mentor support for proposals and outreach',
      'Plans for every stage of your journey',
    ],
  },
];

export default function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal,
    login,
    register,
    isAuth,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();

  const [slide, setSlide] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });

  useEffect(() => {
    if (!authModalOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [authModalOpen]);

  useEffect(() => {
    if (!authModalOpen) return undefined;
    const id = setInterval(() => setSlide((s) => (s + 1) % EXPLORE_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, [authModalOpen]);

  useEffect(() => {
    if (authModalOpen) {
      setError('');
      setSubmitting(false);
    }
  }, [authModalOpen, authModalMode]);

  if (authLoading || isAuth || !authModalOpen) return null;

  const current = EXPLORE_SLIDES[slide];

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) closeAuthModal();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const user = await login(loginForm.email, loginForm.password);
      navigate(getPostAuthPath(user));
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const user = await register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
      });
      navigate(getPostAuthPath(user));
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Sign up"
    >
      <div className="relative flex w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left panel */}
        <div className="hidden w-[42%] flex-col justify-between bg-gradient-to-b from-[#226f7a] to-[#1f5a63] p-8 text-white sm:flex">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{current.title}</h2>
            <div className="mt-8 flex flex-col items-center">
              <div className="relative flex h-36 w-36 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-white/10" />
                <div className="absolute -right-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#226f7a] shadow">
                  {current.caption}
                </div>
                <svg className="relative h-20 w-20 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M12 14v7" />
                </svg>
              </div>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-white/95">
              {current.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/80" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex justify-center gap-2">
            {EXPLORE_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSlide(i)}
                className={`h-2 w-2 rounded-full transition ${i === slide ? 'bg-white' : 'bg-white/40'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-1 flex-col px-6 py-8 sm:px-10">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0b3d42] text-xs font-bold text-white">
              SC
            </div>
            <span className="text-sm font-semibold text-[#0b3d42]">Scholaris</span>
          </div>

          {authModalMode === 'choice' && (
            <>
              <h3 className="text-xl font-bold leading-snug text-[#0b3d42] sm:text-2xl">
                Join students who use Scholaris to find funded programs and guided applications
              </h3>
              <p className="mt-2 text-sm text-gray-500">Get free access to our scholarship catalog!</p>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title="Coming soon"
                  className="pointer-events-none flex w-full cursor-not-allowed items-center justify-center gap-2 rounded border border-[#4285F4] bg-white px-4 py-2.5 text-sm font-semibold text-[#4285F4] opacity-45"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-wide">
                    <span className="bg-white px-2 text-gray-400">or continue with email</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Create account with email
                </button>

                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="flex w-full items-center justify-center gap-2 rounded bg-[#0b3d42] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#06262a]"
                >
                  Log in with email
                </button>
              </div>

              <p className="mt-5 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="font-semibold text-[#226f7a] hover:underline"
                >
                  Log in
                </button>
              </p>
            </>
          )}

          {authModalMode === 'login' && (
            <>
              <h3 className="text-xl font-bold text-[#0b3d42]">Welcome back</h3>
              <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>

              <form onSubmit={handleLogin} className="mt-5 space-y-4">
                {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
                <div>
                  <label htmlFor="modal-login-email" className="label-field">Email</label>
                  <input
                    id="modal-login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="modal-login-password" className="label-field">Password</label>
                  <input
                    id="modal-login-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="input-field"
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
                  {submitting ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-gray-600">
                New here?{' '}
                <button type="button" onClick={() => setAuthModalMode('register')} className="font-semibold text-[#226f7a] hover:underline">
                  Create account
                </button>
                {' · '}
                <button type="button" onClick={() => setAuthModalMode('choice')} className="text-gray-500 hover:underline">
                  Back
                </button>
              </p>
            </>
          )}

          {authModalMode === 'register' && (
            <>
              <h3 className="text-xl font-bold text-[#0b3d42]">Create your free account</h3>
              <p className="mt-1 text-sm text-gray-500">Unlock full scholarship details and guidance</p>

              <form onSubmit={handleRegister} className="mt-5 space-y-3">
                {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
                <div>
                  <label htmlFor="modal-reg-name" className="label-field">Full name</label>
                  <input
                    id="modal-reg-name"
                    required
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="modal-reg-email" className="label-field">Email</label>
                  <input
                    id="modal-reg-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="modal-reg-password" className="label-field">Password</label>
                    <input
                      id="modal-reg-password"
                      type="password"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-reg-confirm" className="label-field">Confirm</label>
                    <input
                      id="modal-reg-confirm"
                      type="password"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
                  {submitting ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button type="button" onClick={() => setAuthModalMode('login')} className="font-semibold text-[#226f7a] hover:underline">
                  Log in
                </button>
                {' · '}
                <button type="button" onClick={() => setAuthModalMode('choice')} className="text-gray-500 hover:underline">
                  Back
                </button>
              </p>
            </>
          )}

          <p className="mt-auto pt-6 text-center text-[11px] leading-relaxed text-gray-400">
            By registering, you agree to our{' '}
            <a href="/policies" className="font-semibold text-[#0b3d42] underline">Policies &amp; Guidelines</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
