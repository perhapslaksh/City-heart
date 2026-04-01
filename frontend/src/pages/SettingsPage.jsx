import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { User, Lock, Globe } from 'lucide-react';
import api from '../utils/api';
import { useAuthStore } from '../context/authStore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    bio:         user?.bio || '',
    avatar:      user?.avatar || '',
    isPrivate:   user?.isPrivate || false,
  });

  const mut = useMutation(() => api.put('/users/me', form), {
    onSuccess: ({ data }) => { updateUser(data.user); toast.success('Profile updated!'); },
    onError: () => toast.error('Failed to save'),
  });

  const set = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));

  return (
    <div className="h-full overflow-y-auto bg-paper">
      <div className="max-w-lg mx-auto px-5 py-8">
        <h1 className="font-display text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-5">
          {/* Profile */}
          <div className="bg-white rounded-2xl p-5 border border-sand/40 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User size={15} className="text-terracotta" />
              <h2 className="font-semibold text-sm">Profile</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-ink/40 uppercase tracking-widest block mb-1.5">Display name</label>
                <input value={form.displayName} onChange={set('displayName')} className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs font-mono text-ink/40 uppercase tracking-widest block mb-1.5">Bio</label>
                <textarea value={form.bio} onChange={set('bio')} className="input-field resize-none" rows={2} maxLength={200} placeholder="Tell the world about yourself…" />
              </div>
              <div>
                <label className="text-xs font-mono text-ink/40 uppercase tracking-widest block mb-1.5">Avatar URL</label>
                <input value={form.avatar} onChange={set('avatar')} className="input-field" placeholder="https://…" />
                {form.avatar && <img src={form.avatar} alt="" className="w-12 h-12 rounded-full object-cover mt-2" onError={e => e.target.style.display='none'} />}
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-2xl p-5 border border-sand/40 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              {form.isPrivate ? <Lock size={15} className="text-dusk" /> : <Globe size={15} className="text-sage" />}
              <h2 className="font-semibold text-sm">Privacy</h2>
            </div>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium">{form.isPrivate ? 'Private account' : 'Public account'}</p>
                <p className="text-xs text-ink/45 mt-0.5">
                  {form.isPrivate ? 'Only approved followers can see your map' : 'Anyone can see your map and reviews'}
                </p>
              </div>
              <div onClick={() => setForm(f => ({...f, isPrivate: !f.isPrivate}))}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative flex-shrink-0 ml-4 ${form.isPrivate ? 'bg-dusk' : 'bg-sage'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 shadow transition-all ${form.isPrivate ? 'left-6' : 'left-1'}`} />
              </div>
            </label>
          </div>

          {/* Read-only info */}
          <div className="bg-cream rounded-2xl p-4 border border-sand/40">
            <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-1">Username</p>
            <p className="text-sm font-medium">@{user?.username}</p>
          </div>

          <button onClick={() => mut.mutate()} disabled={mut.isLoading} className="btn-primary w-full">
            {mut.isLoading ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
