import React, { useState } from 'react';
import { X, MapPin, ExternalLink } from 'lucide-react';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';
import { StarRating } from '../shared/StarRating';
import toast from 'react-hot-toast';

const TYPES = [
  { value:'heart',      label:'♥ Love it',    active:'bg-pin text-white',       idle:'border-sand hover:border-pin/50 text-ink/60' },
  { value:'bookmark',   label:'🔖 Save',       active:'bg-terracotta text-white', idle:'border-sand hover:border-terracotta/50 text-ink/60' },
  { value:'visited',    label:'✓ Visited',     active:'bg-sage text-white',       idle:'border-sand hover:border-sage/50 text-ink/60' },
  { value:'want_to_go', label:'✦ Dream',       active:'bg-gold text-white',       idle:'border-sand hover:border-gold/50 text-ink/60' },
];

export default function PlacePanel({ bookmark, onClose, onRefresh }) {
  const qc = useQueryClient();
  const place = bookmark.place || bookmark;

  const [type,    setType]    = useState(bookmark.type || 'bookmark');
  const [rating,  setRating]  = useState(bookmark.review?.rating || 0);
  const [text,    setText]    = useState(bookmark.review?.text || '');
  const [tags,    setTags]    = useState(bookmark.review?.tags || []);
  const [tagIn,   setTagIn]   = useState('');
  const [editing, setEditing] = useState(!bookmark._id);

  const saveMut = useMutation(
    () => api.post(`/places/${place._id}/bookmark`, { type, review: (text || rating) ? { text, rating, tags } : undefined }),
    { onSuccess: () => { toast.success('Saved! 📍'); qc.invalidateQueries('myBookmarks'); setEditing(false); onRefresh?.(); } }
  );

  const removeMut = useMutation(
    () => api.delete(`/places/${place._id}/bookmark`),
    { onSuccess: () => { toast.success('Removed'); qc.invalidateQueries('myBookmarks'); onRefresh?.(); onClose(); } }
  );

  const addTag = (e) => {
    if (e.key === 'Enter' && tagIn.trim()) {
      e.preventDefault();
      if (!tags.includes(tagIn.trim())) setTags(t => [...t, tagIn.trim()]);
      setTagIn('');
    }
  };

  return (
    <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-paper border-l border-sand/60 z-20 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-start gap-3 p-5 border-b border-sand/40">
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-semibold leading-tight">{place.name}</h2>
          {place.city && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={11} className="text-terracotta" />
              <span className="text-xs text-ink/55">{place.city}{place.country ? `, ${place.country}` : ''}</span>
            </div>
          )}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <a href={`https://www.google.com/maps/search/?api=1&query=${place.coordinates?.coordinates?.[1]},${place.coordinates?.coordinates?.[0]}`}
            target="_blank" rel="noreferrer"
            className="p-2 rounded-xl hover:bg-cream transition-colors">
            <ExternalLink size={15} className="text-ink/50" />
          </a>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-cream transition-colors">
            <X size={15} className="text-ink/60" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Type selector */}
        <div>
          <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-2">Mark as</p>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map(t => (
              <button key={t.value} onClick={() => setType(t.value)}
                className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${type === t.value ? t.active : t.idle}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Review */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-mono text-ink/40 uppercase tracking-widest">Review</p>
            {!editing && bookmark._id && (
              <button onClick={() => setEditing(true)} className="text-xs text-terracotta hover:underline">Edit</button>
            )}
          </div>

          {editing ? (
            <div className="space-y-3">
              <StarRating rating={rating} onRate={setRating} />
              <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
                placeholder="What made this place special?" maxLength={500}
                className="input-field resize-none text-sm" />
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map(t => (
                    <span key={t} className="tag-pill flex items-center gap-1">
                      {t}
                      <button onClick={() => setTags(ts => ts.filter(x => x !== t))} className="text-ink/40 hover:text-pin ml-0.5 leading-none">×</button>
                    </span>
                  ))}
                </div>
                <input value={tagIn} onChange={e => setTagIn(e.target.value)} onKeyDown={addTag}
                  placeholder="Add tags — press Enter (cozy, hidden gem…)"
                  className="input-field text-sm" />
              </div>
            </div>
          ) : (
            <div>
              {bookmark.review?.rating > 0 && <StarRating rating={bookmark.review.rating} readonly size={15} />}
              {bookmark.review?.text
                ? <p className="text-sm text-ink/75 mt-2 leading-relaxed italic">"{bookmark.review.text}"</p>
                : <p className="text-sm text-ink/35 italic">No review yet — tap Edit to add one</p>
              }
              {bookmark.review?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {bookmark.review.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        {place.bookmarkCount > 0 && (
          <p className="text-xs text-ink/35 font-mono">{place.bookmarkCount} people saved this place</p>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-sand/40 p-4 flex gap-2">
        <button onClick={() => saveMut.mutate()} disabled={saveMut.isLoading} className="btn-primary flex-1">
          {saveMut.isLoading ? 'Saving…' : 'Save to map'}
        </button>
        {bookmark._id && (
          <button onClick={() => removeMut.mutate()} disabled={removeMut.isLoading}
            className="px-4 py-2.5 rounded-full border border-pin/30 text-pin text-sm hover:bg-pin/5 transition-colors">
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
