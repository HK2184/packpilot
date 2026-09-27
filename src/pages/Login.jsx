import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [error, setError] = useState('');

  const disabled = status === 'loading';

  const savedUserId = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem('tripPlannerUserId') || '';
  }, []);

  const hint = useMemo(() => {
    if (isAuthenticated) return 'You’re signed in.';
    return 'Use the backend ADMIN_EMAIL / ADMIN_PASSWORD.';
  }, [isAuthenticated]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-7 md:p-10 text-white">
        <div className="text-xs font-black tracking-[0.25em] uppercase text-white/60">Account</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">Sign in</h1>
        <p className="mt-3 text-white/70 font-semibold max-w-xl">
          This is a simple demo auth (JWT) so your Groq calls can stay server-side.
        </p>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-white/60">
              Email or ID
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={savedUserId ? savedUserId : 'admin@example.com'}
              className="mt-2 w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-4 focus:ring-blue-400/30"
              autoComplete="email"
              disabled={disabled}
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-white/60">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              className="mt-2 w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-4 focus:ring-blue-400/30"
              autoComplete="current-password"
              disabled={disabled}
            />
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200/30 bg-red-500/10 px-4 py-3 text-sm text-red-100 font-semibold">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {!isAuthenticated ? (
            <button
              type="button"
              disabled={disabled}
              onClick={async () => {
                setError('');
                setStatus('loading');
                try {
                  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                  });
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok || !data?.ok || !data?.token) {
                    throw new Error(data?.message || 'Login failed');
                  }
                  login(data.token);
                  navigate('/', { replace: true });
                } catch (e) {
                  setError(e?.message || 'Login failed');
                  setStatus('error');
                  return;
                }
                setStatus('idle');
              }}
              className="rounded-2xl bg-white text-slate-950 px-6 py-3 font-black hover:bg-blue-50 transition disabled:opacity-60"
            >
              {status === 'loading' ? 'Signing in…' : 'Sign in'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                logout();
              }}
              className="rounded-2xl bg-white/10 border border-white/15 px-6 py-3 font-black text-white hover:bg-white/15 transition"
            >
              Logout
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-2xl bg-white/10 border border-white/15 px-6 py-3 font-black text-white hover:bg-white/15 transition"
          >
            Back home
          </button>

          {!isAuthenticated ? (
            <Link
              to="/register"
              className="rounded-2xl bg-white/10 border border-white/15 px-6 py-3 font-black text-white hover:bg-white/15 transition"
            >
              Create account
            </Link>
          ) : null}
        </div>
      </div>

      <aside className="lg:col-span-5 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 text-white">
        <div className="text-[11px] font-black uppercase tracking-widest text-white/70">Status</div>
        <div className="mt-2 text-white font-black">{hint}</div>
        {savedUserId ? (
          <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
            <div className="text-sm font-black text-white">Saved user ID</div>
            <div className="mt-1 text-sm font-semibold text-white/70 break-all">{savedUserId}</div>
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => setEmail(savedUserId)}
                className="mt-3 rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-sm font-black text-white hover:bg-white/15 transition"
              >
                Use this ID to sign in
              </button>
            ) : null}
          </div>
        ) : null}
        <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
          <div className="text-sm font-black text-white">Backend</div>
          <div className="text-sm font-semibold text-white/70">{BACKEND_URL}</div>
        </div>
        <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
          <div className="text-sm font-black text-white">What this unlocks</div>
          <div className="mt-2 text-sm font-semibold text-white/70">
            - Server-side Groq calls (key stays hidden)
            <br />
            - Weather fetched from backend
          </div>
        </div>
      </aside>
    </div>
  );
}
