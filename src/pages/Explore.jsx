import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_BACKEND_PORT = 5000;
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (typeof window !== 'undefined'
    ? `http://${window.location.hostname}:${DEFAULT_BACKEND_PORT}`
    : `http://localhost:${DEFAULT_BACKEND_PORT}`);

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    window.clearTimeout(timer);
  }
}

const collections = [
  {
    title: 'Weekend Getaways',
    description: 'Fast trips, big vibes — in 48 hours.',
    tags: ['City', 'Food', 'Museums'],
    accent: 'from-cyan-400/30 to-indigo-500/20',
  },
  {
    title: 'Beach Escapes',
    description: 'Sun, sand, and a packing list that actually fits.',
    tags: ['Beach', 'Relax', 'Swim'],
    accent: 'from-emerald-400/25 to-cyan-400/15',
  },
  {
    title: 'Adventure Trails',
    description: 'Hike-ready lists with layers and essentials.',
    tags: ['Hiking', 'Outdoors', 'Gear'],
    accent: 'from-indigo-400/25 to-purple-500/15',
  },
  {
    title: 'Business Trips',
    description: 'Minimal carry. Maximum readiness.',
    tags: ['Work', 'Formal', 'Tech'],
    accent: 'from-slate-400/20 to-indigo-500/10',
  },
];

const destinations = [
  { name: 'Tokyo', country: 'Japan', mood: 'Neon nights + ramen runs', price: '₹₹₹' },
  { name: 'Bali', country: 'Indonesia', mood: 'Beach club → sunset', price: '₹₹' },
  { name: 'Paris', country: 'France', mood: 'Museums + cafés', price: '₹₹₹₹' },
  { name: 'Dubai', country: 'UAE', mood: 'Skyline + shopping', price: '₹₹₹₹' },
  { name: 'Cape Town', country: 'South Africa', mood: 'Coastline + trails', price: '₹₹₹' },
  { name: 'New York', country: 'USA', mood: 'Shows + street food', price: '₹₹₹₹' },
];

export default function Explore() {
  const [query, setQuery] = useState('');
  const [lastTrip, setLastTrip] = useState(null);
  const [weatherByKey, setWeatherByKey] = useState({});
  const [weatherLoadingKey, setWeatherLoadingKey] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('packpilot_last_trip');
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.destination) {
        setLastTrip(parsed);
        const city = String(parsed.destination).split(',')[0].trim();
        if (city) setQuery(city);
      }
    } catch {
      // ignore
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter((d) =>
      `${d.name} ${d.country} ${d.mood}`.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const fetchWeatherFor = async (name, country) => {
    const key = `${name}, ${country}`;
    if (weatherLoadingKey) return;
    setWeatherLoadingKey(key);
    try {
      const res = await fetchWithTimeout(
        `${BACKEND_URL}/api/weather?destination=${encodeURIComponent(key)}`,
        {},
        9000,
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.message || 'Weather failed');
      setWeatherByKey((prev) => ({ ...prev, [key]: data.weather || null }));
    } catch (e) {
      setToast(e?.name === 'AbortError' ? 'Weather timed out' : e?.message || 'Weather failed');
    } finally {
      setWeatherLoadingKey('');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-7 md:p-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-white/60 text-xs font-black tracking-[0.25em] uppercase">
              Explore
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl font-black text-white tracking-tight">
              Find your next trip vibe
            </h1>
            <p className="mt-2 text-white/70 font-semibold max-w-2xl">
              Browse curated collections, then jump back to the packing builder any time.
            </p>

            {lastTrip?.destination ? (
              <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                <div className="text-xs font-black uppercase tracking-widest text-white/60">
                  Based on your last trip
                </div>
                <div className="mt-1 text-white font-black">
                  {String(lastTrip.destination)}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const city = String(lastTrip.destination).split(',')[0].trim();
                      setQuery(city || String(lastTrip.destination));
                    }}
                    className="rounded-full bg-white text-slate-950 px-4 py-2 text-sm font-black hover:bg-blue-50 transition"
                  >
                    Use this city
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        window.localStorage.removeItem('packpilot_last_trip');
                      } catch {
                        // ignore
                      }
                      setLastTrip(null);
                      setQuery('');
                    }}
                    className="rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm font-black text-white hover:bg-white/15 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="w-full md:w-[360px]">
            <label className="text-xs font-black uppercase tracking-wider text-white/60">
              Search destinations
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lastTrip?.destination ? `Try: ${String(lastTrip.destination).split(',')[0].trim()}…` : 'Try: Tokyo, beach, skyline…'}
              className="mt-2 w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-4 focus:ring-blue-400/30"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {collections.map((c) => (
          <div
            key={c.title}
            className={`rounded-3xl border border-white/15 bg-gradient-to-br ${c.accent} bg-white/5 backdrop-blur-xl p-6`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-white text-xl font-black">{c.title}</div>
                <div className="mt-1 text-white/70 font-semibold">{c.description}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-black rounded-full px-3 py-1 bg-white/10 border border-white/15 text-white/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/15 grid place-items-center">
                <span aria-hidden="true">🧭</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-white text-xl font-black">Trending destinations</h2>
          <div className="text-white/60 text-sm font-bold">{filtered.length} results</div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <div
              key={`${d.name}-${d.country}`}
              className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-5 hover:bg-white/10 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-white text-lg font-black">
                    {d.name}{' '}
                    <span className="text-white/60 text-sm font-extrabold">• {d.country}</span>
                  </div>
                  <div className="mt-2 text-white/70 font-semibold">{d.mood}</div>
                </div>
                <div className="text-white/70 text-sm font-black">{d.price}</div>
              </div>

              <div className="mt-4 flex gap-2">
                <span className="text-xs font-black rounded-full px-3 py-1 bg-blue-400/10 border border-blue-300/15 text-white/80">
                  Best time: Oct–Mar
                </span>
                <span className="text-xs font-black rounded-full px-3 py-1 bg-white/10 border border-white/15 text-white/80">
                  3–7 days
                </span>
              </div>

              {weatherByKey?.[`${d.name}, ${d.country}`] ? (
                <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-white/60">
                        Live weather
                      </div>
                      <div className="mt-1 text-sm font-semibold text-white/80">
                        {weatherByKey[`${d.name}, ${d.country}`]?.current?.text || 'Forecast'}
                      </div>
                    </div>
                    <div className="text-white font-black">
                      <span className="mr-2" aria-hidden="true">
                        {weatherByKey[`${d.name}, ${d.country}`]?.current?.icon || '🌡️'}
                      </span>
                      {typeof weatherByKey[`${d.name}, ${d.country}`]?.current?.tempC === 'number'
                        ? `${Math.round(weatherByKey[`${d.name}, ${d.country}`].current.tempC)}°C`
                        : '--'}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to={`/?destination=${encodeURIComponent(`${d.name}, ${d.country}`)}`}
                  className="rounded-full bg-white text-slate-950 px-4 py-2 text-sm font-black hover:bg-blue-50 transition"
                >
                  Plan this trip
                </Link>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${d.name}, ${d.country}`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm font-black text-white hover:bg-white/15 transition"
                >
                  Open in Maps
                </a>
                <a
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(d.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm font-black text-white hover:bg-white/15 transition"
                >
                  Quick guide
                </a>
                <button
                  type="button"
                  onClick={() => fetchWeatherFor(d.name, d.country)}
                  disabled={Boolean(weatherLoadingKey)}
                  className="rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm font-black text-white hover:bg-white/15 transition disabled:opacity-60"
                >
                  {weatherLoadingKey === `${d.name}, ${d.country}` ? 'Loading…' : 'Get live weather'}
                </button>
              </div>
            </div>
          ))}
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
