import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import Map, { Marker } from 'react-map-gl';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import { RatingDisplay } from '../components/shared/StarRating';

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export default function CityPage() {
  const { city: cityParam } = useParams();
  const city = decodeURIComponent(cityParam);

  const { data, isLoading } = useQuery(
    ['city', city],
    () => api.get(`/cities/${encodeURIComponent(city)}`).then(r => r.data)
  );

  if (isLoading) return (
    <div className="h-full overflow-y-auto bg-paper p-6 space-y-4 max-w-4xl mx-auto">
      {[1,2,3].map(i => <div key={i} className="shimmer h-32 rounded-2xl" />)}
    </div>
  );

  const { trendingPlaces = [], recentReviews = [], topLists = [] } = data || {};
  const withCoords = trendingPlaces.filter(p => p.coordinates?.coordinates);
  const center = withCoords[0]
    ? { longitude: withCoords[0].coordinates.coordinates[0], latitude: withCoords[0].coordinates.coordinates[1], zoom: 11 }
    : { longitude: 0, latitude: 20, zoom: 2 };

  return (
    <div className="h-full overflow-y-auto bg-paper">
      {/* Hero map */}
      <div className="relative h-52">
        <Map initialViewState={center} mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={TOKEN} style={{ width:'100%', height:'100%' }} interactive={false}>
          {withCoords.map(p => (
            <Marker key={p._id} longitude={p.coordinates.coordinates[0]} latitude={p.coordinates.coordinates[1]} anchor="center">
              <div className="w-2.5 h-2.5 rounded-full bg-pin border-2 border-white shadow" />
            </Marker>
          ))}
        </Map>
        <div className="absolute inset-0 bg-gradient-to-t from-paper/95 to-transparent" />
        <div className="absolute bottom-5 left-6">
          <h1 className="font-display text-4xl font-bold">{city}</h1>
          <p className="text-ink/50 text-sm">{trendingPlaces.length} places · {recentReviews.length} reviews</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8 space-y-12">

        {/* Trending places */}
        <section>
          <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-4">📈 Trending in {city}</p>
          {trendingPlaces.length === 0
            ? <p className="text-sm text-ink/35">No places yet — be the first to pin something here!</p>
            : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {trendingPlaces.map((p, i) => (
                  <div key={p._id} className="bg-white rounded-2xl border border-sand/40 overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="relative h-24 bg-gradient-to-br from-cream to-sand flex items-center justify-center">
                      {p.coverPhoto ? <img src={p.coverPhoto} alt="" className="w-full h-full object-cover" /> : <span className="text-3xl opacity-20">🗺️</span>}
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-ink flex items-center justify-center">
                        <span className="text-paper text-[10px] font-bold font-mono">{i+1}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <RatingDisplay rating={p.averageRating} />
                        <span className="text-[10px] text-ink/35 font-mono">{p.bookmarkCount} saves</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          }
        </section>

        {/* Top lists */}
        {topLists.length > 0 && (
          <section>
            <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-4">📋 Top Lists</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {topLists.map(list => (
                <Link key={list._id} to={`/list/${list._id}`}
                  className="bg-white rounded-2xl p-4 border border-sand/40 shadow-sm hover:shadow-md hover:border-terracotta/30 transition-all group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{list.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm group-hover:text-terracotta transition-colors truncate">{list.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-ink/40">@{list.user?.username}</span>
                        <span className="text-ink/20 text-xs">·</span>
                        <span className="text-xs text-ink/40">{list.places?.length} places</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent reviews */}
        <section>
          <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-4">⭐ Recent Reviews</p>
          {recentReviews.length === 0
            ? <p className="text-sm text-ink/35">No reviews yet.</p>
            : <div className="space-y-3">
                {recentReviews.map(b => (
                  <div key={b._id} className="bg-white rounded-2xl p-4 border border-sand/40 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Link to={`/${b.user?.username}`} className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-cream overflow-hidden flex items-center justify-center">
                          {b.user?.avatar
                            ? <img src={b.user.avatar} alt="" className="w-full h-full object-cover" />
                            : <span className="text-xs font-bold text-terracotta">{b.user?.username?.[0]?.toUpperCase()}</span>
                          }
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link to={`/${b.user?.username}`} className="text-sm font-semibold hover:underline">{b.user?.username}</Link>
                          <span className="text-xs text-ink/35">at</span>
                          <span className="text-sm text-terracotta font-medium">{b.place?.name}</span>
                          <span className="text-[10px] text-ink/25 ml-auto">{formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}</span>
                        </div>
                        {b.review?.rating > 0 && <div className="flex mt-0.5">{'★'.repeat(b.review.rating).split('').map((s,i) => <span key={i} className="text-gold text-xs">{s}</span>)}</div>}
                        {b.review?.text && <p className="text-sm text-ink/65 mt-1 leading-relaxed italic">"{b.review.text}"</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          }
        </section>
      </div>
    </div>
  );
}
