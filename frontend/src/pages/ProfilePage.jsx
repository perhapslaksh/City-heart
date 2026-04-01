import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Map, { Marker } from 'react-map-gl';
import { Lock, Plus, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import { useAuthStore } from '../context/authStore';
import { StarRating } from '../components/shared/StarRating';
import CreateListModal from '../components/lists/CreateListModal';
import toast from 'react-hot-toast';

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const PIN_BG = { heart:'#E84545', bookmark:'#C4664A', visited:'#6B8C6E', want_to_go:'#C9993A' };

function PlaceGrid({ bookmarks }) {
  if (!bookmarks.length) return <div className="col-span-3 py-16 text-center text-ink/35"><p className="text-4xl mb-2">📍</p><p className="text-sm">No places pinned yet</p></div>;
  return bookmarks.map(b => (
    <div key={b._id} className="bg-white rounded-2xl border border-sand/40 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="h-28 bg-gradient-to-br from-cream to-sand flex items-center justify-center relative">
        {b.place?.coverPhoto
          ? <img src={b.place.coverPhoto} alt="" className="w-full h-full object-cover" />
          : <span className="text-3xl opacity-20">🗺️</span>
        }
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs text-white shadow"
          style={{ background: PIN_BG[b.type] || PIN_BG.bookmark }}>
          {b.type === 'heart' ? '♥' : b.type === 'visited' ? '✓' : b.type === 'want_to_go' ? '✦' : '🔖'}
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold truncate">{b.place?.name}</p>
        <p className="text-xs text-ink/45 truncate">{b.place?.city}</p>
        {b.review?.rating > 0 && <div className="flex mt-1">{'★'.repeat(b.review.rating).split('').map((s,i) => <span key={i} className="text-gold text-xs">{s}</span>)}</div>}
        {b.review?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {b.review.tags.slice(0,2).map(t => <span key={t} className="tag-pill text-[10px]">{t}</span>)}
          </div>
        )}
      </div>
    </div>
  ));
}

export default function ProfilePage() {
  const { username } = useParams();
  const { user: me } = useAuthStore();
  const qc = useQueryClient();
  const [view, setView] = useState('grid');
  const [createList, setCreateList] = useState(false);

  const { data, isLoading } = useQuery(['profile', username], () => api.get(`/users/${username}`).then(r => r.data));
  const { data: bookmarks = [] } = useQuery(['bookmarks', username], () => api.get(`/users/${username}/bookmarks`).then(r => r.data), { enabled: !!data && !data.user?.hiddenProfile });
  const { data: lists = [] }     = useQuery(['lists', username],    () => api.get(`/users/${username}/lists`).then(r => r.data),    { enabled: !!data && !data.user?.hiddenProfile });

  const followMut = useMutation(
    () => data?.isFollowing
      ? api.delete(`/users/${data.user._id}/follow`)
      : api.post(`/users/${data.user._id}/follow`),
    {
      onSuccess: (res) => {
        qc.invalidateQueries(['profile', username]);
        const s = res.data.status;
        toast.success(s === 'following' ? 'Following!' : s === 'pending' ? 'Request sent' : 'Unfollowed');
      }
    }
  );

  if (isLoading) return <div className="flex items-center justify-center h-full"><div className="shimmer w-48 h-8 rounded-xl" /></div>;
  const user = data?.user;
  if (!user) return <div className="p-8 text-center text-ink/45">User not found</div>;
  const isOwner = me?.username === username;

  return (
    <div className="h-full overflow-y-auto bg-paper">
      {/* Cover */}
      <div className="h-36 bg-gradient-to-br from-terracotta/20 via-gold/10 to-dusk/20" />

      <div className="max-w-2xl mx-auto px-5">
        {/* Avatar + actions */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="w-20 h-20 rounded-2xl border-4 border-paper bg-cream shadow-lg overflow-hidden flex items-center justify-center">
            {user.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              : <span className="font-display text-3xl text-terracotta">{user.username?.[0]?.toUpperCase()}</span>
            }
          </div>
          <div className="flex gap-2 mb-1">
            {isOwner
              ? <Link to="/settings" className="btn-outline flex items-center gap-1.5 text-sm py-2 px-4"><Settings size={13} /> Edit</Link>
              : !user.hiddenProfile && (
                  <button onClick={() => followMut.mutate()} disabled={followMut.isLoading}
                    className={data?.isFollowing ? 'btn-outline text-sm py-2 px-5' : 'btn-primary text-sm py-2 px-5'}>
                    {data?.isFollowing ? 'Following' : 'Follow'}
                  </button>
                )
            }
          </div>
        </div>

        {/* Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold">{user.displayName || user.username}</h1>
            {user.isPrivate && <Lock size={13} className="text-ink/35" />}
          </div>
          <p className="text-sm text-ink/45 font-mono">@{user.username}</p>
          {user.bio && <p className="text-sm text-ink/75 mt-2 max-w-sm leading-relaxed">{user.bio}</p>}
          <div className="flex gap-5 mt-3">
            {[['pins', bookmarks.length],['lists', lists.length],['followers', user.followers?.length || 0],['following', user.following?.length || 0]].map(([l,v]) => (
              <div key={l}><span className="font-mono font-medium text-ink">{v}</span><span className="text-xs text-ink/40 ml-1">{l}</span></div>
            ))}
          </div>
        </div>

        {/* Private wall */}
        {user.hiddenProfile ? (
          <div className="text-center py-20 border-2 border-dashed border-sand rounded-3xl mb-8">
            <Lock size={28} className="mx-auto text-sand mb-3" />
            <p className="font-display text-lg font-semibold mb-1">Private account</p>
            <p className="text-sm text-ink/45 mb-4">Follow to see their map and reviews</p>
            {!isOwner && (
              <button onClick={() => followMut.mutate()} className="btn-primary">Request to follow</button>
            )}
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-1 bg-cream rounded-xl p-1 mb-6 w-fit">
              {[['grid','📍 Places'],['map','🗺️ Map'],['lists','📋 Lists']].map(([id, label]) => (
                <button key={id} onClick={() => setView(id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === id ? 'bg-ink text-paper' : 'text-ink/55 hover:text-ink'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Grid */}
            {view === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-8">
                <PlaceGrid bookmarks={bookmarks} />
              </div>
            )}

            {/* Map */}
            {view === 'map' && (
              <div className="rounded-2xl overflow-hidden shadow-sm mb-8" style={{ height: 440 }}>
                <Map initialViewState={{ longitude: 20, latitude: 20, zoom: 1.5 }}
                  mapStyle="mapbox://styles/mapbox/light-v11"
                  mapboxAccessToken={TOKEN}
                  style={{ width:'100%', height:'100%' }}
                  interactive={false}>
                  {bookmarks.map(b => {
                    const [lng, lat] = b.place?.coordinates?.coordinates || [];
                    if (!lng) return null;
                    return (
                      <Marker key={b._id} longitude={lng} latitude={lat} anchor="center">
                        <div className="w-3 h-3 rounded-full border-2 border-white shadow"
                          style={{ background: PIN_BG[b.type] || PIN_BG.bookmark }} />
                      </Marker>
                    );
                  })}
                </Map>
              </div>
            )}

            {/* Lists */}
            {view === 'lists' && (
              <div className="pb-8">
                {isOwner && (
                  <button onClick={() => setCreateList(true)}
                    className="flex items-center gap-2 text-sm text-terracotta hover:underline mb-4">
                    <Plus size={13} /> New list
                  </button>
                )}
                {lists.length === 0
                  ? <p className="text-sm text-ink/35 py-8 text-center">No lists yet</p>
                  : <div className="grid sm:grid-cols-2 gap-3">
                      {lists.map(list => (
                        <Link key={list._id} to={`/list/${list._id}`}
                          className="bg-white rounded-2xl p-4 border border-sand/40 shadow-sm hover:shadow-md hover:border-terracotta/30 transition-all group">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{list.emoji}</span>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm group-hover:text-terracotta transition-colors truncate">{list.name}</p>
                              <p className="text-xs text-ink/40">{list.places?.length || 0} places</p>
                            </div>
                          </div>
                          {list.description && <p className="text-xs text-ink/50 mt-2 leading-relaxed">{list.description}</p>}
                        </Link>
                      ))}
                    </div>
                }
              </div>
            )}
          </>
        )}
      </div>

      {createList && (
        <CreateListModal
          onClose={() => setCreateList(false)}
          onCreated={() => { qc.invalidateQueries(['lists', username]); setCreateList(false); }}
        />
      )}
    </div>
  );
}
