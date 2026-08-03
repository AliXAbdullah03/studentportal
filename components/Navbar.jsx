'use client';

import { Link, NavLink, useNavigate } from '@/lib/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/scholarships', label: 'Scholarships' },
  { to: '/plans', label: 'Services' },
  { to: '/mentorship', label: 'Mentorship' },
  { to: '/guidance', label: 'Guidance' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuth, user, logout, dashboardPath, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-ink to-brand-500 text-sm font-bold text-white shadow-soft">
            SC
          </div>
          <div className="leading-tight">
            <span className="font-display text-lg font-bold tracking-tight text-ink sm:text-xl">Scholaris</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-500 sm:block">
              Global Mobility
            </span>
          </div>
        </Link>

        <nav className="hidden items-center rounded-full bg-ink px-2 py-1.5 shadow-nav lg:flex">
          {LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  isActive ? 'bg-gold text-white' : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:+923000000000" className="hidden items-center gap-1.5 text-sm font-semibold text-ink xl:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mist text-brand-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            Get in touch
          </a>
          {isAuth ? (
            <>
              <Link to={dashboardPath} className="text-sm font-semibold text-ink hover:text-ink-soft">
                {user?.name}
              </Link>
              <button type="button" onClick={handleLogout} className="text-sm text-ink-muted hover:text-ink">
                Logout
              </button>
            </>
          ) : (
            <button type="button" onClick={() => openAuthModal('choice')} className="btn-primary !py-2 !text-sm">
              Free Consultation
            </button>
          )}
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-ink hover:bg-mist lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-mist text-ink' : 'text-ink-soft'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAuth ? (
              <>
                <Link to={dashboardPath} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink">
                  My Dashboard
                </Link>
                <button type="button" onClick={handleLogout} className="mt-2 rounded-full border border-ink/15 px-3 py-2 text-left text-sm">
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => { setOpen(false); openAuthModal('choice'); }}
                className="btn-primary mt-2 w-full"
              >
                Free Consultation
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
