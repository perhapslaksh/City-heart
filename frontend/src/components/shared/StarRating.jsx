import React, { useState } from 'react';

export function StarRating({ rating = 0, onRate, readonly = false, size = 18 }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || rating;
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" disabled={readonly}
          onClick={() => !readonly && onRate?.(s)}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{ fontSize: size, lineHeight: 1 }}
          className={`transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} ${display >= s ? 'text-gold' : 'text-sand'}`}
        >★</button>
      ))}
    </div>
  );
}

export function RatingDisplay({ rating, count }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      <span className="text-gold text-sm">★</span>
      <span className="font-mono text-sm font-medium">{Number(rating).toFixed(1)}</span>
      {count != null && <span className="text-xs text-ink/40">({count})</span>}
    </div>
  );
}
