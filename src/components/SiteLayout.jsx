import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-300 shadow-[0_10px_30px_rgba(79,70,229,0.25)] grid place-items-center">
        <span className="text-white font-black" aria-hidden="true">
          ✈️
        </span>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-black tracking-tight text-white">PackPilot</div>
        <div className="text-[11px] font-extrabold tracking-widest uppercase text-white/60">
          Smart Packing
        </div>
      </div>
    </Link>
  );
}

function TopNav() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const { isAuthenticated, logout } = useAuth();

  const linkBase =
    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition';

  const navLink = ({ isActive }) =>
    `${linkBase} ${
      isActive
        ? 'bg-white/15 text-white border border-white/15'
        : 'text-white/80 hover:text-white hover:bg-white/10'
    }`;

  return (
    <header className="w-full text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-5 flex items-center justify-between gap-4">
        <BrandMark />

        <nav className="hidden md:flex items-center gap-2">
          <NavLink className={navLink} to="/explore">
            Explore
          </NavLink>
          <NavLink className={navLink} to="/deals">
            Deals
          </NavLink>
          <NavLink className={navLink} to="/support">
            Support
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <a
            className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black border border-white/15 bg-white/10 hover:bg-white/15 transition"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            <span aria-hidden="true">⭐</span>
            Star
          </a>
          {!isHome ? (
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition shadow bg-white text-slate-950 hover:bg-blue-50"
            >
              <span aria-hidden="true">✨</span>
              New Trip
            </Link>
          ) : isAuthenticated ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black border border-white/15 bg-white/10 hover:bg-white/15 transition"
              onClick={() => logout()}
            >
              <span aria-hidden="true">🚪</span>
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black border border-white/15 bg-white/10 hover:bg-white/15 transition"
            >
              <span aria-hidden="true">👤</span>
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="md:hidden max-w-6xl mx-auto px-4 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
        <NavLink className={navLink} to="/explore">
          Explore
        </NavLink>
        <NavLink className={navLink} to="/deals">
          Deals
        </NavLink>
        <NavLink className={navLink} to="/support">
          Support
        </NavLink>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-4 md:px-10 py-10 text-white/70">
      <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
        <div className="text-sm">
          <div className="font-black text-white">PackPilot</div>
          <div className="text-white/60">Explore • Deals • Support</div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-bold">
          <Link className="hover:text-white" to="/support">
            Help Center
          </Link>
          <Link className="hover:text-white" to="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-white" to="/terms">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950">
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 md:px-10 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
