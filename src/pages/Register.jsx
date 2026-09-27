import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const disabled = status === 'loading';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-7 md:p-10 text-white">
        <div className="text-xs font-black tracking-[0.25em] uppercase text-white/60">Account</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">Create account</h1>
        <p className="mt-3 text-white/70 font-semibold max-w-xl">
          Frontend-only UI + backend file storage (demo). Your account will be stored in the backend folder.
        </p>

        {isAuthenticated ? (
          <div className="mt-6 rounded-2xl border border-emerald-200/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 font-semibold">
            You’re already signed in. Go back{' '}
            <Link className="underline" to="/">
              home
            </Link>
            .
          </div>
        ) : null}

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-white/60">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              placeholder="At least 8 characters"
              type="password"
              className="mt-2 w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-4 focus:ring-blue-400/30"
              autoComplete="new-password"
              disabled={disabled}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-black uppercase tracking-wider text-white/60">Confirm password</label>
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              type="password"
              className="mt-2 w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-4 focus:ring-blue-400/30"
              autoComplete="new-password"
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
          <button
            type="button"
            disabled={disabled || isAuthenticated}
            onClick={async () => {
              setError('');

              const trimmedEmail = email.trim();
              if (!trimmedEmail || !trimmedEmail.includes('@')) {
                setError('Enter a valid email.');
                return;
              }
              if (password.length < 8) {
                setError('Password must be at least 8 characters.');
                return;
              }
              if (password !== confirm) {
                setError('Passwords do not match.');
                return;
              }

              setStatus('loading');
              try {
                const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: trimmedEmail, password }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok || !data?.ok || !data?.token) {
                  throw new Error(data?.message || 'Registration failed');
                }
                if (data?.user?.id) {
                  window.localStorage.setItem('tripPlannerUserId', String(data.user.id));
                }
                login(data.token);
                navigate('/', { replace: true });
              } catch (e) {
                setError(e?.message || 'Registration failed');
                setStatus('idle');
                return;
              }
              setStatus('idle');
            }}
            className="rounded-2xl bg-white text-slate-950 px-6 py-3 font-black hover:bg-blue-50 transition disabled:opacity-60"
          >
            {status === 'loading' ? 'Creating…' : 'Create account'}
          </button>

          <Link
            to="/login"
            className="rounded-2xl bg-white/10 border border-white/15 px-6 py-3 font-black text-white hover:bg-white/15 transition"
          >
            I already have an account
          </Link>
        </div>
      </div>

      <aside className="lg:col-span-5 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 text-white">
        <div className="text-[11px] font-black uppercase tracking-widest text-white/70">Backend</div>
        <div className="mt-2 text-white font-black">{BACKEND_URL}</div>
        <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
          <div className="text-sm font-black text-white">Where accounts are stored</div>
          <div className="text-sm font-semibold text-white/70">
            trip-planner-backend/users.json
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
          <div className="text-sm font-black text-white">Note</div>
          <div className="text-sm font-semibold text-white/70">
            This is a demo storage method. For production you’d use a database + proper password policies.
          </div>
        </div>
      </aside>
    </div>
  );
}
