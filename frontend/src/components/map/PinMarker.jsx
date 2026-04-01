import React, { useState } from 'react';
import { Marker } from 'react-map-gl';

const PIN_STYLE = {
  heart:       { bg: '#E84545', icon: '♥' },
  bookmark:    { bg: '#C4664A', icon: '🔖' },
  visited:     { bg: '#6B8C6E', icon: '✓' },
  want_to_go:  { bg: '#C9993A', icon: '✦' },
};

export default function PinMarker({ bookmark, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [lng, lat] = bookmark.place?.coordinates?.coordinates || [];
  if (!lng) return null;
  const s = PIN_STYLE[bookmark.type] || PIN_STYLE.bookmark;

  return (
    <Marker longitude={lng} latitude={lat} anchor="bottom" onClick={onClick}>
      <div className="relative cursor-pointer pin-drop"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none whitespace-nowrap z-10">
            <div className="glass rounded-xl px-3 py-1.5 shadow-lg text-xs font-medium border border-sand/50">
              {bookmark.place.name}
              {bookmark.review?.rating > 0 && <span className="ml-1 text-gold">{'★'.repeat(bookmark.review.rating)}</span>}
            </div>
          </div>
        )}
        <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{ background: s.bg }}>
          <span className="text-white text-sm leading-none">{s.icon}</span>
        </div>
        <div className="w-0.5 h-2.5 mx-auto" style={{ background: s.bg }} />
        <div className="w-1.5 h-1.5 rounded-full bg-ink/20 mx-auto" />
      </div>
    </Marker>
  );
}
