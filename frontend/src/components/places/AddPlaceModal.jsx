import React, { useState, useRef } from 'react';
import { X, Search, MapPin } from 'lucide-react';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';
import { StarRating } from '../shared/StarRating';
import toast from 'react-hot-toast';

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const TYPES = [
  { v:'heart',      l:'♥ Love it' },
  { v:'bookmark',   l:'🔖 Save' },
  { v:'visited',    l:'✓ Visited' },
  { v:'want_to_go', l:'✦ Dream' },
];

export default function AddPlaceModal({ onClose }) {
  const qc = useQueryClient();
  const [step, setStep]       = useState(1);
  const [searchQ, setSearchQ] = useState('');
  const [results, setResults] = useState([]);
  const [feature, setFeature] = useState(null);
  const [type,    setType]    = useState('bookmark');
  const [rating,  setRating]  = useState(0);
  const [text,    setText]    = useState('');
  const [tags,    setTags]    = useState([]);
  const [tagIn,   setTagIn]   = useState('');
  const timer = useRef();

  const geocode = (v) => {
    clearTimeout(timer.current);
    if (!v.trim()) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(v)}.json?access_token=${TOKEN}&limit=5`);
        const d = await r.json();
        setResults(d.features || []);
      } catch {}
    }, 300);
  };

  const saveMut = useMutation(async () => {
    const [lng, lat] = feature.center;
    const ctx = feature.context || [];
    const city    = ctx.find(c => c.id.startsWith('place'))?.text || feature.place_name.split(',')[1]?.trim() || '';
    const country = ctx.find(c => c.id.startsWith('country'))?.text || '';
    const placeRes = await api.post('/places', {
      mapboxId: feature.id, name: feature.text || feature.place_name,
      address: feature.place_name, city, country,
      coordinates: { type: 'Point', coordinates: [lng, lat] },
    });
    await api.post(`/places/${placeRes.data._id}/bookmark`, {
      type,
      review: (text || rating) ? { text, rating, tags } : undefined,
    });
  }, {
    onSuccess: () => { toast.success('Pinned! 📍'); qc.invalidateQueries('myBookmarks'); onClose(); },
    onError: (e)  => toast.error(e.response?.data?.message || 'Failed to save'),
  });

  const addTag = (e) => {
    if (e.key === 'Enter' && tagIn.trim()) {
      e.preventDefault();
      if (!tags.includes(tagIn.trim())) setTags(t => [...t, tagIn.trim()]);
      setTagIn('');
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}>
      <div className="bg-paper rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-semibold">{step === 1 ? 'Find a place' : 'Add to your map'}</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-cream transition-colors"><X size={16} /></button>
          </div>

          {step === 1 ? (
            <div>
              <div className="relative mb-2">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                <input autoFocus value={searchQ}
                  onChange={e => { setSearchQ(e.target.value); geocode(e.target.value); }}
                  className="input-field pl-9" placeholder="Search any place in the world…" />
              </div>
              <div className="space-y-0.5">
                {results.map(r => (
                  <button key={r.id} onClick={() => { setFeature(r); setStep(2); }}
                    className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl hover:bg-cream text-left transition-colors">
                    <MapPin size={13} className="text-terracotta mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{r.text}</p>
                      <p className="text-xs text-ink/45 truncate">{r.place_name}</p>
                    </div>
                  </button>
                ))}
                {searchQ && !results.length && (
                  <p className="text-center py-8 text-ink/40 text-sm">No results</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected place */}
              <div className="bg-cream rounded-xl p-3 flex items-center gap-2">
                <MapPin size={13} className="text-terracotta flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{feature.text}</p>
                  <p className="text-xs text-ink/45 truncate">{feature.place_name}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-xs text-terracotta hover:underline flex-shrink-0">Change</button>
              </div>

              {/* Type */}
              <div>
                <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-2">Mark as</p>
                <div className="grid grid-cols-2 gap-2">
                  {TYPES.map(t => (
                    <button key={t.v} onClick={() => setType(t.v)}
                      className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${type === t.v ? 'bg-ink text-paper border-ink' : 'border-sand hover:border-ink/40 text-ink/60'}`}>
                      {t.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-2">Rating</p>
                <StarRating rating={rating} onRate={setRating} />
              </div>

              {/* Review */}
              <div>
                <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-2">Review <span className="normal-case">(optional)</span></p>
                <textarea value={text} onChange={e => setText(e.target.value)} rows={2} maxLength={500}
                  placeholder="What made this place special?" className="input-field resize-none text-sm" />
              </div>

              {/* Tags */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map(t => (
                    <span key={t} className="tag-pill flex items-center gap-1">
                      {t}
                      <button onClick={() => setTags(ts => ts.filter(x => x !== t))} className="text-ink/40 hover:text-pin ml-0.5">×</button>
                    </span>
                  ))}
                </div>
                <input value={tagIn} onChange={e => setTagIn(e.target.value)} onKeyDown={addTag}
                  placeholder="Tags: cozy, hidden gem… (press Enter)" className="input-field text-sm" />
              </div>

              <button onClick={() => saveMut.mutate()} disabled={saveMut.isLoading} className="btn-primary w-full">
                {saveMut.isLoading ? 'Saving…' : 'Pin to my map 📍'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
