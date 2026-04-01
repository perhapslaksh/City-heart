import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../utils/api';

const VIBES = ['cozy','instagrammable','hidden gem','rooftop','aesthetic','street food','sunset view','local favorite','vintage','late night','romantic','artsy'];
const CITY_EMOJI = { Delhi:'🏛️', Mumbai:'🌊', Tokyo:'🌸', Paris:'🗼', Rome:'🏟️', 'New York':'🗽', London:'🎡', Barcelona:'☀️', Bangkok:'🐘', Istanbul:'🕌' };

function useDebounce(val, ms) {
  const [dv, setDv] = useState(val);
  useEffect(() => { const t = setTimeout(() => setDv(val), ms); return () => clearTimeout(t); }, [val, ms]);
  return dv;
}

export default function ExplorePage() {
  const [q, setQ] = useState('');
  const dq = useDebounce(q, 300);

  const { data: cities = [] } = useQuery('cities', () => api.get('/cities').then(r => r.data), { enabled: !dq });
  const { data: users = [] } = useQuery(
    ['searchUsers', dq],
    () => api.get(`/users/search?q=${dq}`).then(r => r.data),
    { enabled: dq.length > 1 }
  );

  return (
    <div className="h-full overflow-y-auto bg-paper">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-1">Explore</h1>
        <p className="text-ink/45 text-sm mb-6">Discover cities, people, and hidden gems</p>

        {/* Search */}
        <div className="relative mb-8">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search cities or people…"
            className="w-full pl-10 pr-4 py-3.5 bg-white border border-sand/60 rounded-2xl text-sm outline-none focus:border-terracotta transition-colors shadow-sm" />
        </div>

        {dq.length > 1 ? (
          /* Search results */
          <div>
            {users.length > 0 && (
              <div>
                <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-3">People</p>
                <div className="space-y-2">
                  {users.map(u => (
                    <Link key={u._id} to={`/${u.username}`}
                      className="flex items-center gap-3 bg-white rounded-2xl p-3.5 border border-sand/40 shadow-sm hover:shadow-md hover:border-terracotta/30 transition-all">
                      <div className="w-10 h-10 rounded-full bg-cream overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {u.avatar
                          ? <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                          : <span className="font-bold text-terracotta">{u.username?.[0]?.toUpperCase()}</span>
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{u.displayName || u.username}</p>
                        <p className="text-xs text-ink/45">@{u.username}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {users.length === 0 && (
              <p className="text-center py-16 text-ink/35 text-sm">No results for "{dq}"</p>
            )}
          </div>
        ) : (
          /* Default view */
          <div className="space-y-10">
            {/* Vibes */}
            <section>
              <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-4">Browse by vibe</p>
              <div className="flex flex-wrap gap-2">
                {VIBES.map(v => (
                  <button key={v} onClick={() => setQ(v)}
                    className="tag-pill py-2 px-4 hover:bg-ink hover:text-paper hover:border-ink cursor-pointer transition-all">
                    {v}
                  </button>
                ))}
              </div>
            </section>

            {/* Cities */}
            <section>
              <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-4">Cities on the map</p>
              {cities.length === 0
                ? <p className="text-sm text-ink/35">No cities yet — start pinning places!</p>
                : <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {cities.map(city => (
                      <Link key={city._id} to={`/city/${encodeURIComponent(city._id)}`}
                        className="bg-white rounded-2xl p-4 border border-sand/40 shadow-sm hover:shadow-md hover:border-terracotta/30 transition-all group">
                        <span className="text-2xl block mb-2">{CITY_EMOJI[city._id] || '🌆'}</span>
                        <p className="font-semibold text-sm group-hover:text-terracotta transition-colors">{city._id}</p>
                        <p className="text-xs text-ink/40 mt-0.5">{city.count} places</p>
                      </Link>
                    ))}
                  </div>
              }
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
