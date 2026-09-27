import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-8 md:p-12 text-white">
      <div className="text-xs font-black tracking-[0.25em] uppercase text-white/60">404</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">Page not found</h1>
      <p className="mt-3 text-white/70 font-semibold max-w-2xl">
        The page you’re looking for doesn’t exist. Use the nav or jump back home.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/"
          className="rounded-full bg-white text-slate-950 px-5 py-2.5 text-sm font-black hover:bg-blue-50 transition"
        >
          Go home
        </Link>
        <Link
          to="/explore"
          className="rounded-full bg-white/10 border border-white/15 px-5 py-2.5 text-sm font-black text-white hover:bg-white/15 transition"
        >
          Explore
        </Link>
      </div>
    </div>
  );
}
