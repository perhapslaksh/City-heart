import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import Map, { Marker } from 'react-map-gl';
import { Lock, MapPin } from 'lucide-react';
import api from '../utils/api';
import { RatingDisplay } from '../components/shared/StarRating';

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export default function ListPage() {
  const { id } = useParams();
  const { data: list, isLoading } = useQuery(['list', id], () => api.get(`/lists/${id}`).then(r => r.data));

  if (isLoading) return <div className="flex items-center justify-center h-full"><div className="shimmer w-48 h-8 rounded-xl" /></div>;
  if (!list) return <div className="p-8 text-center text-ink/45">List not found</div>;

  const withCoords = list.places?.filter(p => p.coordinates?.coordinates) || [];

  return (
    <div className="h-full overflow-y-auto bg-paper">
      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="mb-8">
          <span className="text-5xl block mb-3">{list.emoji}</span>
          <h1 className="font-display text-3xl font-bold">{list.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Link to={`/${list.user?.username}`} className="flex items-center gap-2 hover:underline">
              <div className="w-5 h-5 rounded-full bg-cream overflow-hidden flex-shrink-0">
                {list.user?.avatar && <img src={list.user.avatar} alt="" className="w-full h-full object-cover" />}
              </div>
              <span className="text-sm text-ink/55">@{list.user?.username}</span>
            </Link>
            <span className="text-ink/25 text-sm">·</span>
            <span className="text-sm text-ink/45">{list.places?.length || 0} places</span>
            {!list.isPublic && <Lock size={11} className="text-ink/35" />}
          </div>
          {list.description && <p className="text-sm text-ink/65 mt-3 max-w-md leading-relaxed">{list.description}</p>}
        </div>

        {/* Mini map */}
        {withCoords.length > 0 && (
          <div className="rounded-2xl overflow-hidden shadow-sm mb-8" style={{ height: 240 }}>
            <Map
              initialViewState={{ longitude: withCoords[0].coordinates.coordinates[0], latitude: withCoords[0].coordinates.coordinates[1], zoom: 9 }}
              mapStyle="mapbox://styles/mapbox/light-v11"
              mapboxAccessToken={TOKEN}
              style={{ width:'100%', height:'100%' }}
              interactive={false}>
              {withCoords.map(p => (
                <Marker key={p._id} longitude={p.coordinates.coordinates[0]} latitude={p.coordinates.coordinates[1]} anchor="center">
                  <div className="w-2.5 h-2.5 rounded-full bg-terracotta border-2 border-white shadow" />
                </Marker>
              ))}
            </Map>
          </div>
        )}

        {/* Places grid */}
        {list.places?.length === 0
          ? <p className="text-center py-16 text-ink/35 text-sm">No places in this list yet</p>
          : <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {list.places?.map(place => (
                <div key={place._id} className="bg-white rounded-2xl border border-sand/40 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-28 bg-gradient-to-br from-cream to-sand flex items-center justify-center">
                    {place.coverPhoto
                      ? <img src={place.coverPhoto} alt="" className="w-full h-full object-cover" />
                      : <span className="text-3xl opacity-20">🗺️</span>
                    }
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold truncate">{place.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-mist" />
                      <p className="text-xs text-ink/45 truncate">{place.city}</p>
                    </div>
                    <RatingDisplay rating={place.averageRating} count={place.reviewCount} />
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}
