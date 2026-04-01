import React, { useState, useCallback } from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import { useQuery } from 'react-query';
import { Layers, X } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import api from '../utils/api';
import { useAuthStore } from '../context/authStore';
import { useMapStore } from '../context/mapStore';
import PinMarker from '../components/map/PinMarker';
import PlacePanel from '../components/map/PlacePanel';
import MapSearchBar from '../components/map/MapSearchBar';

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const STYLES = [
  { id: 'mapbox://styles/mapbox/light-v11',            label: 'Light' },
  { id: 'mapbox://styles/mapbox/dark-v11',             label: 'Dark' },
  { id: 'mapbox://styles/mapbox/outdoors-v12',         label: 'Outdoors' },
  { id: 'mapbox://styles/mapbox/satellite-streets-v12',label: 'Satellite' },
];
const FILTER_TYPES = [
  { value: 'all',       label: 'All' },
  { value: 'heart',     label: '♥ Hearts' },
  { value: 'bookmark',  label: '🔖 Saved' },
  { value: 'visited',   label: '✓ Visited' },
  { value: 'want_to_go',label: '✦ Dream' },
];

export default function MapPage() {
  const { user } = useAuthStore();
  const { viewport, setViewport, selectedBookmark, selectBookmark, clearSelection } = useMapStore();
  const [mapStyle, setMapStyle] = useState(STYLES[0].id);
  const [stylePicker, setStylePicker] = useState(false);
  const [filter, setFilter] = useState('all');

  const { data: bookmarks = [], refetch } = useQuery(
    ['myBookmarks', user?.username],
    () => api.get(`/users/${user.username}/bookmarks`).then(r => r.data),
    { enabled: !!user }
  );

  const visible = filter === 'all' ? bookmarks : bookmarks.filter(b => b.type === filter);

  return (
    <div className="relative w-full h-full">
      <Map
        {...viewport}
        onMove={e => setViewport(e.viewState)}
        mapStyle={mapStyle}
        mapboxAccessToken={TOKEN}
        style={{ width: '100%', height: '100%' }}
        onClick={useCallback((e) => {
          if (!e.features?.length) clearSelection();
        }, [clearSelection])}
      >
        <NavigationControl position="bottom-right" />
        {visible.map(b => (
          <PinMarker key={b._id} bookmark={b} onClick={() => selectBookmark(b)} />
        ))}
      </Map>

      {/* Search bar */}
      <div className="absolute top-4 left-4 w-80 z-10">
        <MapSearchBar />
      </div>

      {/* Filter chips */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {FILTER_TYPES.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm ${
              filter === f.value
                ? 'bg-ink text-paper'
                : 'glass text-ink hover:bg-cream border border-sand/50'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Map style picker */}
      <div className="absolute bottom-20 right-4 z-10">
        <button onClick={() => setStylePicker(s => !s)}
          className="glass rounded-xl p-2.5 shadow-lg hover:bg-cream transition-all border border-sand/50">
          <Layers size={17} className="text-ink" />
        </button>
        {stylePicker && (
          <div className="absolute bottom-12 right-0 glass rounded-2xl p-1.5 shadow-xl border border-sand/50 min-w-[110px]">
            {STYLES.map(s => (
              <button key={s.id} onClick={() => { setMapStyle(s.id); setStylePicker(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors ${mapStyle === s.id ? 'bg-ink text-paper' : 'hover:bg-cream text-ink'}`}>
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Empty state */}
      {bookmarks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="glass rounded-3xl p-8 text-center max-w-xs shadow-xl border border-sand/50">
            <div className="text-5xl mb-3">🗺️</div>
            <h3 className="font-display text-xl font-semibold mb-2">Your map is empty</h3>
            <p className="text-sm text-ink/55">Click "Add Place" in the sidebar to drop your first pin</p>
          </div>
        </div>
      )}

      {/* Place panel */}
      {selectedBookmark && (
        <PlacePanel bookmark={selectedBookmark} onClose={clearSelection} onRefresh={refetch} />
      )}
    </div>
  );
}
