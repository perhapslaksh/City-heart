import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ username:'', email:'', password:'', displayName:'' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await register(form.username, form.email, form.password, form.displayName);
      toast.success(`Welcome to CityHeart, ${user.displayName || user.username}! 🗺️`);
      navigate('/map');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const set = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-terracotta to-dusk flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <span className="text-white text-lg font-bold">♥</span>
          </div>
          <span className="font-display text-2xl text-white">CityHeart</span>
        </Link>
        <div>
          <p className="font-display text-5xl text-white/90 leading-tight mb-8">
            Pin the places<br />you love.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {['My Delhi Cafes ☕','2026 Europe ✈️','Aesthetic Spots 📸','Hidden Gems 💎','Rooftop Bars 🌆','Late Night Tokyo 🌙'].map(l => (
              <div key={l} className="bg-white/15 backdrop-blur rounded-xl px-3 py-2 text-white text-xs font-medium">{l}</div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-sm">Join thousands of explorers sharing their world</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-ink rounded-xl flex items-center justify-center">
              <span className="text-paper text-sm font-bold">♥</span>
            </div>
            <span className="font-display text-xl font-semibold">CityHeart</span>
          </Link>

          <h1 className="font-display text-3xl font-bold mb-1">Create account</h1>
          <p className="text-ink/50 text-sm mb-8">Start mapping your world</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-ink/45 uppercase tracking-widest block mb-1.5">Display name</label>
              <input type="text" value={form.displayName} onChange={set('displayName')}
                className="input-field" placeholder="How should we call you?" />
            </div>
            <div>
              <label className="text-xs font-mono text-ink/45 uppercase tracking-widest block mb-1.5">Username *</label>
              <input type="text" value={form.username}
                onChange={e => setForm(f => ({...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,'')}))}
                className="input-field" placeholder="your_username" required />
            </div>
            <div>
              <label className="text-xs font-mono text-ink/45 uppercase tracking-widest block mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={set('email')}
                className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-xs font-mono text-ink/45 uppercase tracking-widest block mb-1.5">Password *</label>
              <input type="password" value={form.password} onChange={set('password')}
                className="input-field" placeholder="Min. 6 characters" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account…' : 'Join CityHeart'}
            </button>
          </form>

          <p className="text-center text-sm text-ink/50 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-terracotta font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
