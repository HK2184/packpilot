import React, { useEffect, useMemo, useState } from 'react';

const allDeals = [
  {
    id: 'deal-1',
    title: 'Last-minute Beach Bundle',
    subtitle: '2 nights • flight + stay',
    badge: 'Hot',
    price: 'From ₹19,999',
    url: 'https://www.makemytrip.com/',
    perks: ['Free breakfast', 'Airport pickup', 'Late checkout'],
    tone: 'from-emerald-400/25 to-cyan-400/15',
  },
  {
    id: 'deal-2',
    title: 'City Explorer Pass',
    subtitle: '3 days • museums + transit',
    badge: 'New',
    price: 'From ₹3,499',
    url: 'https://www.getyourguide.com/',
    perks: ['Skip-the-line', 'Metro card', 'Audio guide'],
    tone: 'from-indigo-400/25 to-purple-500/15',
  },
  {
    id: 'deal-3',
    title: 'Business Flex Fare',
    subtitle: 'Change anytime • seat included',
    badge: 'Flexible',
    price: 'From ₹9,999',
    url: 'https://www.skyscanner.net/',
    perks: ['Free reschedule', 'Priority boarding', 'Carry-on'],
    tone: 'from-slate-300/20 to-indigo-500/10',
  },
  {
    id: 'deal-4',
    title: 'Adventure Gear Add-on',
    subtitle: 'Hike kit • curated essentials',
    badge: 'Pro',
    price: 'From ₹1,299',
    url: 'https://www.decathlon.com/',
    perks: ['Trail checklist', 'Layer guide', 'Offline maps'],
    tone: 'from-cyan-400/20 to-blue-500/15',
  },
];

export default function Deals() {
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState('');
  const [email, setEmail] = useState('');
  const [lastTrip, setLastTrip] = useState(null);
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem('packpilot_saved_deals');
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('packpilot_saved_deals', JSON.stringify(Array.from(saved)));
    } catch {
      // ignore
    }
  }, [saved]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('packpilot_last_trip');
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.destination) setLastTrip(parsed);
    } catch {
      // ignore
    }
  }, []);

  const cityQuery = useMemo(() => {
    const destination = lastTrip?.destination ? String(lastTrip.destination) : '';
    const city = destination ? destination.split(',')[0].trim() : '';
    return city || destination;
  }, [lastTrip]);

  const dealLinks = useMemo(() => {
    const q = cityQuery ? encodeURIComponent(cityQuery) : '';
    return {
      hotels: q ? `https://www.booking.com/searchresults.html?ss=${q}` : 'https://www.booking.com/',
      activities: q ? `https://www.getyourguide.com/s/?q=${q}` : 'https://www.getyourguide.com/',
      flights: q ? `https://www.skyscanner.net/transport/flights-to/${q.toLowerCase()}/` : 'https://www.skyscanner.net/',
      gear: 'https://www.decathlon.com/',
    };
  }, [cityQuery]);

  const deals = useMemo(() => {
    const base = (() => {
      if (filter === 'all') return allDeals;
      if (filter === 'hot') return allDeals.filter((d) => d.badge.toLowerCase() === 'hot');
      if (filter === 'flex') return allDeals.filter((d) => d.badge.toLowerCase() === 'flexible');
      return allDeals;
    })();

    // City-aware URLs + light personalization
    const mapped = base.map((d) => {
      if (d.id === 'deal-1') {
        return {
          ...d,
          title: cityQuery ? `Stay deals in ${cityQuery}` : d.title,
          subtitle: cityQuery ? `Hotels • top stays for ${cityQuery}` : d.subtitle,
          url: dealLinks.hotels,
        };
      }
      if (d.id === 'deal-2') {
        return {
          ...d,
          title: cityQuery ? `Things to do in ${cityQuery}` : d.title,
          subtitle: cityQuery ? `Tours • attractions • passes` : d.subtitle,
          url: dealLinks.activities,
        };
      }
      if (d.id === 'deal-3') {
        return {
          ...d,
          title: cityQuery ? `Flights to ${cityQuery}` : d.title,
          subtitle: cityQuery ? `Compare routes • flexible fares` : d.subtitle,
          url: cityQuery ? `https://www.google.com/search?q=${encodeURIComponent(`flights to ${cityQuery}`)}` : d.url,
        };
      }
      if (d.id === 'deal-4') {
        return {
          ...d,
          title:
            Array.isArray(lastTrip?.activities) && lastTrip.activities.includes('🥾 Hiking')
              ? 'Hiking gear essentials'
              : d.title,
          url: dealLinks.gear,
        };
      }
      return d;
    });

    // If user selected certain activities, surface relevant deal first
    const acts = Array.isArray(lastTrip?.activities) ? lastTrip.activities : [];
    if (acts.includes('🥾 Hiking')) {
      const gear = mapped.find((d) => d.id === 'deal-4');
      const rest = mapped.filter((d) => d.id !== 'deal-4');
      return gear ? [gear, ...rest] : mapped;
    }
    if (acts.includes('🏖️ Beach')) {
      const stay = mapped.find((d) => d.id === 'deal-1');
      const rest = mapped.filter((d) => d.id !== 'deal-1');
      return stay ? [stay, ...rest] : mapped;
    }

    return mapped;
  }, [filter, cityQuery, dealLinks, lastTrip]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-7 md:p-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-white/60 text-xs font-black tracking-[0.25em] uppercase">
              Deals
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl font-black text-white tracking-tight">
              Smart bundles for smoother trips
            </h1>
            <p className="mt-2 text-white/70 font-semibold max-w-2xl">
              Frontend-only demo cards (you can later connect real offers from an API).
            </p>
            {cityQuery ? (
              <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white/80">
                Showing quick links for <span className="font-black text-white">{cityQuery}</span>.
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'hot', label: 'Hot' },
              { id: 'flex', label: 'Flexible' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                className={`rounded-full px-4 py-2 text-sm font-black border transition ${
                  filter === t.id
                    ? 'bg-white text-slate-950 border-white'
                    : 'bg-white/10 text-white border-white/15 hover:bg-white/15'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {deals.map((d) => (
          <div
            key={d.id}
            className={`rounded-3xl border border-white/15 bg-gradient-to-br ${d.tone} bg-white/5 backdrop-blur-xl p-6`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2">
                  <span className="text-white text-xl font-black">{d.title}</span>
                  <span className="text-[11px] font-black uppercase tracking-wider rounded-full px-2 py-1 bg-white/10 border border-white/15 text-white/80">
                    {d.badge}
                  </span>
                </div>
                <div className="mt-1 text-white/70 font-semibold">{d.subtitle}</div>
              </div>
              <div className="text-white font-black">{d.price}</div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {d.perks.map((p) => (
                <div
                  key={p}
                  className="rounded-2xl bg-white/10 border border-white/15 px-3 py-2 text-xs font-black text-white/80"
                >
                  {p}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <a
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white text-slate-950 px-5 py-2.5 text-sm font-black hover:bg-blue-50 transition"
              >
                View details
              </a>
              <button
                type="button"
                onClick={() => {
                  setSaved((prev) => {
                    const next = new Set(prev);
                    if (next.has(d.id)) {
                      next.delete(d.id);
                      setToast('Removed from saved');
                    } else {
                      next.add(d.id);
                      setToast('Saved deal');
                    }
                    return next;
                  });
                }}
                className="rounded-full bg-white/10 border border-white/15 px-5 py-2.5 text-sm font-black text-white hover:bg-white/15 transition"
              >
                {saved.has(d.id) ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
        <div className="text-white text-lg font-black">Deal alerts</div>
        <div className="mt-2 text-white/70 font-semibold">
          Get a weekly summary of the best bundles.
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-4 focus:ring-blue-400/30"
            placeholder="Email address"
          />
          <button
            type="button"
            onClick={() => {
              const trimmed = email.trim();
              if (!trimmed || !trimmed.includes('@')) {
                setToast('Enter a valid email');
                return;
              }
              setToast('Subscribed (demo)');
              setEmail('');
            }}
            className="rounded-2xl bg-white text-slate-950 px-6 py-3 font-black hover:bg-blue-50 transition"
          >
            Subscribe
          </button>
        </div>
      </section>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-full bg-white text-slate-900 px-5 py-3 text-sm font-black shadow-2xl border border-white/20">
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
}
