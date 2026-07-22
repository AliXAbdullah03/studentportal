'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/lib/navigation';
import { useAuth } from '@/context/AuthContext';

function NavIcon({ name, className = 'h-4 w-4' }) {
  const props = { className, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'aria-hidden': true };
  switch (name) {
    case 'board':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      );
    case 'list':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      );
    case 'command':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      );
    case 'book':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'guidance':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      );
    case 'sales':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'hr':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'home':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
        </svg>
      );
    case 'traffic':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case 'clients':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'progress':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case 'plans':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case 'search':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" strokeWidth={1.75} />
        </svg>
      );
  }
}

/**
 * Shared settings-style dashboard shell used by Admin, Manager, Consultant, Student.
 */
export default function DashboardShell({
  storageKey = 'dashboard_sidebar_open',
  brandTitle = 'Dashboard',
  brandSubtitle = 'Scholaris',
  roleLabel = 'Portal',
  navGroups = [],
  activeTab,
  onTabChange,
  counts = {},
  title,
  subtitle,
  headerActions = null,
  onLogout,
  children,
}) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === '0') setSidebarOpen(false);
      if (saved === '1') setSidebarOpen(true);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      try { localStorage.setItem(storageKey, next ? '1' : '0'); } catch { /* ignore */ }
      return next;
    });
  };

  const isDesktop = () =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;

  const selectTab = (id) => {
    onTabChange?.(id);
    setMobileOpen(false);
  };

  const sidebar = (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-[#0f1c2e] text-slate-200">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1d6af1] text-sm font-bold text-white">
            GS
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{brandTitle}</p>
            <p className="truncate text-xs text-slate-400">{brandSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isDesktop()) toggleSidebar();
              else setMobileOpen(false);
            }}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = activeTab === item.id;
                const count = counts[item.id];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => selectTab(item.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        active
                          ? 'bg-[#1d6af1] text-white shadow-sm'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <NavIcon name={item.icon} className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span className="min-w-0 flex-1 truncate font-medium">{item.label}</span>
                      {count != null && (
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                          active ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded-lg bg-white/5 px-3 py-2.5">
          <p className="truncate text-sm font-medium text-white">{user?.name}</p>
          <p className="truncate text-xs text-slate-400">{user?.email}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            ← View site
          </Link>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col transition-all duration-300 ${
          sidebarOpen ? 'lg:w-64' : 'lg:w-0 lg:overflow-hidden'
        }`}
      >
        {sidebarOpen && sidebar}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 z-50 shadow-2xl">
            {sidebar}
          </div>
        </div>
      )}

      <div
        className={`flex min-h-screen min-w-0 flex-1 flex-col transition-[padding] duration-300 ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
        }`}
      >
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
              onClick={() => {
                if (isDesktop()) toggleSidebar();
                else setMobileOpen(true);
              }}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <svg className="h-5 w-5 lg:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {sidebarOpen ? (
                <svg className="hidden h-5 w-5 lg:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="hidden h-5 w-5 lg:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{roleLabel}</p>
              <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">{title}</h1>
              {subtitle && (
                <p className="mt-0.5 hidden truncate text-sm text-slate-500 sm:block">{subtitle}</p>
              )}
            </div>
            {headerActions}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
