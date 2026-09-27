import React from 'react';

export default function Terms() {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-7 md:p-10 text-white">
      <div className="text-xs font-black tracking-[0.25em] uppercase text-white/60">Terms</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">Terms of Service</h1>
      <p className="mt-4 text-white/70 font-semibold max-w-3xl leading-relaxed">
        This project is provided as-is for demo purposes. External deal links open third-party sites.
        Weather data comes from Open‑Meteo and may be approximate.
      </p>
      <div className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-5">
        <div className="text-white font-black">External links</div>
        <div className="mt-2 text-white/70 font-semibold">
          When you click a deal, you leave this site. Pricing/availability are owned by the third party.
        </div>
      </div>
    </div>
  );
}
