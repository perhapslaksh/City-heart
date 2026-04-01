import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';

const TYPE_ICON = { follow:'👤', follow_request:'🔔', review_like:'♥', new_review:'✍️' };

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const { data } = useQuery('notifications', () => api.get('/notifications').then(r => r.data), { refetchInterval: 30000 });
  const markAll = useMutation(() => api.put('/notifications/read-all'), { onSuccess: () => qc.invalidateQueries('notifications') });

  const unread = data?.unreadCount || 0;
  const list = data?.notifications || [];

  return (
    <div className="relative w-full">
      <button
        onClick={() => { setOpen(o => !o); if (unread > 0) markAll.mutate(); }}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink/60 hover:bg-cream hover:text-ink transition-all text-sm relative"
      >
        <Bell size={16} className="flex-shrink-0" />
        <span>Notifications</span>
        {unread > 0 && (
          <span className="ml-auto w-5 h-5 rounded-full bg-pin text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-full top-0 ml-2 w-72 bg-paper rounded-2xl shadow-2xl border border-sand/50 z-40 overflow-hidden">
            <div className="px-4 py-3 border-b border-sand/40 font-semibold text-sm">Notifications</div>
            <div className="max-h-80 overflow-y-auto">
              {list.length === 0
                ? <div className="py-10 text-center text-ink/40 text-sm">Nothing yet 🔔</div>
                : list.map(n => (
                  <div key={n._id} className={`flex items-start gap-3 px-4 py-3 hover:bg-cream transition-colors ${!n.read ? 'bg-terracotta/5' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center flex-shrink-0 text-sm">
                      {n.sender?.avatar ? <img src={n.sender.avatar} alt="" className="w-full h-full object-cover rounded-full" /> : TYPE_ICON[n.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-ink/80 leading-relaxed">
                        <Link to={`/${n.sender?.username}`} className="font-semibold hover:underline">{n.sender?.username}</Link>
                        {' '}{n.type === 'follow' ? 'started following you' : n.type === 'follow_request' ? 'wants to follow you' : n.type === 'review_like' ? 'liked your review' : 'reviewed a place you saved'}
                      </p>
                      {n.data?.placeName && <p className="text-[11px] text-terracotta mt-0.5">{n.data.placeName}</p>}
                      <p className="text-[10px] text-ink/30 mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-pin mt-1.5 flex-shrink-0" />}
                  </div>
                ))
              }
            </div>
          </div>
        </>
      )}
    </div>
  );
}
