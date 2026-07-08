import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuth, user, logout, dashboardPath } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition rounded-md ${
      isActive ? 'text-brand-700 bg-brand-50' : 'text-gray-600 hover:text-brand-600 hover:bg-gray-50'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">
            GS
          </div>
          <div>
            <span className="text-lg font-bold text-brand-800">Global Scholarships</span>
            <span className="hidden sm:block text-xs text-gray-500">Study Abroad Financial Aid</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/scholarships" className={linkClass}>Scholarships</NavLink>
          <NavLink to="/mentorship" className={linkClass}>Mentorship</NavLink>
          <NavLink to="/plans" className={linkClass}>Plans</NavLink>
          <NavLink to="/guidance" className={linkClass}>Guidance</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuth ? (
            <>
              <Link to={dashboardPath} className="text-sm font-medium text-gray-700 hover:text-brand-600">
                {user?.name}
              </Link>
              <button type="button" onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-brand-600">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Register</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100"
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
            <NavLink to="/guidance" className={linkClass} onClick={() => setOpen(false)}>Guidance</NavLink>
            <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
            {isAuth ? (
              <>
                <Link to={dashboardPath} className={linkClass} onClick={() => setOpen(false)}>My Dashboard</Link>
                <button type="button" onClick={handleLogout} className="btn-secondary mt-2 text-center">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass} onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary mt-2 text-center" onClick={() => setOpen(false)}>Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
