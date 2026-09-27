import React from 'react';

export default function Privacy() {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-7 md:p-10 text-white">
      <div className="text-xs font-black tracking-[0.25em] uppercase text-white/60">Privacy</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-white/70 font-semibold max-w-3xl leading-relaxed">
        This is a frontend-only demo. No personal data is intentionally stored on a server.
        If you use Login, the auth token is stored in your browser’s localStorage.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
          <div className="text-white font-black">What we store</div>
          <div className="mt-2 text-white/70 font-semibold">
            - Auth token (localStorage)
            <br />
            - Saved deals IDs (localStorage)
          </div>
        </div>
        <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
          <div className="text-white font-black">What we don’t store</div>
          <div className="mt-2 text-white/70 font-semibold">
            - Passwords in the frontend
            <br />
            - Your Groq API key in the browser
          </div>
        </div>
      </div>
    </div>
  );
}
