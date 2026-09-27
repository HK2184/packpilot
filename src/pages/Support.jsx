import React, { useMemo, useState } from 'react';

const faqs = [
  {
    q: 'How does the packing list get generated?',
    a: 'Right now it’s rule-based (duration + activities). Later we can connect a real API (weather, airline limits, etc.).',
    tag: 'Packing',
  },
  {
    q: 'Can I share my packing list?',
    a: 'Yes — the Results screen has Share to Clipboard. We can also add a shareable link later.',
    tag: 'Sharing',
  },
  {
    q: 'Is this connected to a backend?',
    a: 'Not yet. This is frontend-only as requested. We can add a backend endpoint anytime.',
    tag: 'Tech',
  },
  {
    q: 'Can you add login and saved trips?',
    a: 'Yep. We can store drafts in localStorage first, then add auth and a database when you’re ready.',
    tag: 'Account',
  },
];

export default function Support() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((f) => `${f.q} ${f.a} ${f.tag}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-7 md:p-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-white/60 text-xs font-black tracking-[0.25em] uppercase">
              Support
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl font-black text-white tracking-tight">
              We’ve got you
            </h1>
            <p className="mt-2 text-white/70 font-semibold max-w-2xl">
              Quick answers, and an easy way to request features.
            </p>
          </div>

          <div className="w-full md:w-[360px]">
            <label className="text-xs font-black uppercase tracking-wider text-white/60">
              Search help
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: share, backend, login…"
              className="mt-2 w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-4 focus:ring-blue-400/30"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
          <div className="text-white text-lg font-black">Help Center</div>
          <div className="mt-2 text-white/70 font-semibold">
            Read FAQs and tips.
          </div>
          <div className="mt-5 rounded-2xl bg-white/10 border border-white/15 p-4 text-white/80 text-sm font-bold">
            Avg response time: <span className="text-white">Under 2 hours</span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
          <div className="text-white text-lg font-black">Feature Requests</div>
          <div className="mt-2 text-white/70 font-semibold">
            Tell us what to build next.
          </div>
          <button
            type="button"
            className="mt-5 w-full rounded-2xl bg-white text-slate-950 px-6 py-3 font-black hover:bg-blue-50 transition"
          >
            Submit a request
          </button>
        </div>

        <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-cyan-400/15 to-indigo-500/15 backdrop-blur-xl p-6">
          <div className="text-white text-lg font-black">Status</div>
          <div className="mt-2 text-white/70 font-semibold">
            All systems operational.
          </div>
          <div className="mt-5 flex items-center gap-2 text-sm font-black text-white/80">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" aria-hidden="true"></span>
            Live services
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
        <div className="text-white text-xl font-black">FAQs</div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((f) => (
            <details
              key={f.q}
              className="group rounded-3xl border border-white/15 bg-white/5 p-5"
            >
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                <div>
                  <div className="text-white font-black">{f.q}</div>
                  <div className="mt-2 inline-flex text-[11px] font-black uppercase tracking-wider rounded-full px-2 py-1 bg-white/10 border border-white/15 text-white/70">
                    {f.tag}
                  </div>
                </div>
                <div className="text-white/60 group-open:rotate-180 transition" aria-hidden="true">
                  ▾
                </div>
              </summary>
              <div className="mt-4 text-white/75 font-semibold leading-relaxed">{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
        <div className="text-white text-lg font-black">Contact</div>
        <div className="mt-2 text-white/70 font-semibold">
          Frontend-only placeholder form.
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-4 focus:ring-blue-400/30"
            placeholder="Your email"
          />
          <input
            className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-4 focus:ring-blue-400/30"
            placeholder="Subject"
          />
          <textarea
            className="md:col-span-2 min-h-[120px] rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-4 focus:ring-blue-400/30"
            placeholder="Message"
          />
        </div>
        <button
          type="button"
          className="mt-4 rounded-2xl bg-white text-slate-950 px-6 py-3 font-black hover:bg-blue-50 transition"
        >
          Send message
        </button>
      </section>
    </div>
  );
}
