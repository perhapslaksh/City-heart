import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation } from 'react-query';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const EMOJIS = ['📍','☕','✈️','🌍','🗺️','💎','🌆','🌿','🏖️','🍜','📸','🌙','🏔️','🎨','🌸'];

export default function CreateListModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name:'', description:'', emoji:'📍', isPublic:true });

  const mut = useMutation(() => api.post('/lists', form), {
    onSuccess: () => { toast.success('List created!'); onCreated?.(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-paper rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold">New List</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-cream"><X size={15} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-2">Icon</p>
            <div className="flex flex-wrap gap-1.5">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setForm(f => ({...f, emoji:e}))}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${form.emoji === e ? 'bg-ink scale-110' : 'bg-cream hover:bg-sand'}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-1.5">Name *</p>
            <input value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))}
              className="input-field" placeholder="e.g. My Delhi Cafes, 2026 Europe Trip" />
          </div>
          <div>
            <p className="text-xs font-mono text-ink/40 uppercase tracking-widest mb-1.5">Description</p>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description:e.target.value}))}
              className="input-field resize-none" rows={2} placeholder="What's this list about?" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setForm(f => ({...f, isPublic:!f.isPublic}))}
              className={`w-10 h-6 rounded-full transition-colors relative ${form.isPublic ? 'bg-sage' : 'bg-sand'}`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 shadow transition-all ${form.isPublic ? 'left-5' : 'left-1'}`} />
            </div>
            <span className="text-sm">{form.isPublic ? 'Public' : 'Private'}</span>
          </label>
          <button onClick={() => mut.mutate()} disabled={!form.name || mut.isLoading} className="btn-primary w-full">
            {mut.isLoading ? 'Creating…' : 'Create list'}
          </button>
        </div>
      </div>
    </div>
  );
}
