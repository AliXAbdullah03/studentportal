'use client';

import { Link, NavLink, useNavigate } from '@/lib/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuth, user, logout, dashboardPath, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition ${
      isActive ? 'text-[#1a3a5c] border-b-2 border-[#1a3a5c]' : 'text-[#1a3a5c]/80 hover:text-[#1a3a5c]'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-[#1a3a5c] text-sm font-bold text-white">
            GS
          </div>
          <div className="leading-tight">
            <span className="text-base font-bold text-[#1a3a5c] sm:text-lg">PhD Scholarships Hub</span>
            <span className="hidden text-[10px] font-medium uppercase tracking-wide text-[#e85d04] sm:block">
              Doctoral Funding
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink to="/scholarships" className={linkClass}>Scholarships</NavLink>
          <NavLink to="/mentorship" className={linkClass}>Mentorship</NavLink>
          <NavLink to="/plans" className={linkClass}>Plans</NavLink>
          <NavLink to="/guidance" className={linkClass}>Guidance</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuth ? (
            <>
              <Link to={dashboardPath} className="flex items-center gap-2 text-sm font-medium text-[#1a3a5c] hover:opacity-80">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {user?.name}
              </Link>
              <button type="button" onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-[#1a3a5c]">
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('choice')}
              className="flex items-center gap-2 text-sm font-semibold text-[#1a3a5c] hover:opacity-80"
            >
              Sign up
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          )}
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-[#1a3a5c] hover:bg-gray-100 md:hidden"
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
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink to="/scholarships" className={linkClass} onClick={() => setOpen(false)}>Scholarships</NavLink>
            <NavLink to="/mentorship" className={linkClass} onClick={() => setOpen(false)}>Mentorship</NavLink>
            <NavLink to="/plans" className={linkClass} onClick={() => setOpen(false)}>Plans</NavLink>
            <NavLink to="/guidance" className={linkClass} onClick={() => setOpen(false)}>Guidance</NavLink>
            <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
            {isAuth ? (
              <>
                <Link to={dashboardPath} className={linkClass({ isActive: false })} onClick={() => setOpen(false)}>My Dashboard</Link>
                <button type="button" onClick={handleLogout} className="mt-2 rounded border border-gray-300 px-3 py-2 text-left text-sm">
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => { setOpen(false); openAuthModal('choice'); }}
                className="mt-2 rounded bg-[#1a3a5c] px-3 py-2 text-left text-sm font-semibold text-white"
              >
                Sign up / Log in
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
