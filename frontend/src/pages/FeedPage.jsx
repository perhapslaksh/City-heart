import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import { StarRating } from '../components/shared/StarRating';

const TYPE_META = {
  heart:       { icon:'♥', label:'loved',         color:'text-pin' },
  bookmark:    { icon:'🔖', label:'saved',          color:'text-terracotta' },
  visited:     { icon:'✓', label:'visited',        color:'text-sage' },
  want_to_go:  { icon:'✦', label:'wants to visit', color:'text-gold' },
};

function ReviewCard({ bookmark }) {
  const { user, place, review, type, createdAt } = bookmark;
  const meta = TYPE_META[type] || TYPE_META.bookmark;
  if (!place) return null;
  return (
    <article className="bg-white rounded-2xl p-5 border border-sand/40 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
      {/* User */}
      <div className="flex items-center gap-3 mb-4">
        <Link to={`/${user.username}`}>
          {user.avatar
            ? <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
            : <div className="w-9 h-9 rounded-full bg-terracotta/15 flex items-center justify-center">
                <span className="font-bold text-sm text-terracotta">{user.username?.[0]?.toUpperCase()}</span>
              </div>
          }
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to={`/${user.username}`} className="text-sm font-semibold hover:underline">{user.displayName || user.username}</Link>
            <span className={`text-sm ${meta.color}`}>{meta.icon} {meta.label}</span>
          </div>
          <p className="text-xs text-ink/35 mt-0.5">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
        </div>
      </div>

      {/* Place */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight">{place.name}</h3>
          {place.city && (
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={11} className="text-mist" />
              <span className="text-xs text-ink/45">{place.city}{place.country ? `, ${place.country}` : ''}</span>
            </div>
          )}
        </div>
        {review?.rating > 0 && <StarRating rating={review.rating} readonly size={14} />}
      </div>

      {review?.text && (
        <p className="text-sm text-ink/75 leading-relaxed mb-3 italic">"{review.text}"</p>
      )}
      {review?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {review.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
        </div>
      )}
      {review?.photos?.length > 0 && (
        <div className="flex gap-2 mt-3">
          {review.photos.slice(0,3).map((url, i) => (
            <img key={i} src={url} alt="" className="w-20 h-20 rounded-xl object-cover" />
          ))}
        </div>
      )}
    </article>
  );
}

export default function FeedPage() {
  const [mode, setMode] = useState('following');
  const { data: feed = [], isLoading } = useQuery(
    ['feed', mode],
    () => api.get(`/feed?mode=${mode}`).then(r => r.data)
  );

  return (
    <div className="h-full overflow-y-auto bg-paper">
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-1">Feed</h1>
        <p className="text-ink/45 text-sm mb-6">What your people are pinning</p>

        {/* Toggle */}
        <div className="flex gap-1 bg-cream rounded-xl p-1 mb-6 w-fit">
          {[['following','👥 Following'],['discover','🌍 Discover']].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-ink text-paper shadow-sm' : 'text-ink/55 hover:text-ink'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Feed */}
        {isLoading
          ? [1,2,3].map(i => <div key={i} className="shimmer h-48 rounded-2xl mb-4" />)
          : feed.length === 0
            ? <div className="text-center py-20">
                <div className="text-5xl mb-4">🌐</div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  {mode === 'following' ? 'Follow people to see their pins' : 'Nothing here yet'}
                </h3>
                <p className="text-ink/45 text-sm mb-6">Start exploring and following travellers</p>
                <Link to="/explore" className="btn-primary">Explore</Link>
              </div>
            : <div className="space-y-4">
                {feed.map(b => <ReviewCard key={b._id} bookmark={b} />)}
              </div>
        }
      </div>
    </div>
  );
}
