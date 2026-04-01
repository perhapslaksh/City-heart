import React, { useState, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { useMapStore } from '../../context/mapStore';

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export default function MapSearchBar() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const { flyTo } = useMapStore();
  const timer = useRef();

  const search = async (val) => {
    if (!val.trim()) { setResults([]); return; }
    try {
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(val)}.json?access_token=${TOKEN}&limit=6`);
      const d = await res.json();
      setResults(d.features || []);
    } catch {}
  };

  const onChange = (e) => {
    setQ(e.target.value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => search(e.target.value), 300);
  };

  const pick = (f) => {
    const [lng, lat] = f.center;
    flyTo(lng, lat, 14);
    setQ(f.place_name);
    setResults([]);
    setFocused(false);
  };

  return (
    <div className="relative">
      <div className={`glass rounded-2xl shadow-lg overflow-hidden transition-all ${focused ? 'ring-2 ring-terracotta/30' : ''}`}>
        <div className="flex items-center gap-2 px-3 py-3">
          <Search size={15} className="text-ink/40 flex-shrink-0" />
          <input value={q} onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search anywhere in the world..."
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink/40 outline-none"
          />
          {q && <button onClick={() => { setQ(''); setResults([]); }} className="text-ink/30 hover:text-ink"><X size={13} /></button>}
        </div>
        {focused && results.length > 0 && (
          <div className="border-t border-sand/40 pb-1">
            {results.map(r => (
              <button key={r.id} onMouseDown={() => pick(r)}
                className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-cream/80 transition-colors text-left">
                <MapPin size={13} className="text-terracotta mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{r.text}</p>
                  <p className="text-xs text-ink/45 truncate">{r.place_name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
