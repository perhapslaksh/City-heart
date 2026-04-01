import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ emailOrUsername: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.emailOrUsername, form.password);
      toast.success(`Welcome back, ${user.displayName || user.username} ✈️`);
      navigate('/map');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-terracotta flex items-center justify-center">
            <span className="text-white text-lg font-bold">♥</span>
          </div>
          <span className="font-display text-2xl text-paper">CityHeart</span>
        </Link>
        <div>
          <p className="font-display text-4xl text-paper/90 leading-tight mb-4 italic">
            "Not all those who wander are lost."
          </p>
          <p className="text-paper/40 text-sm font-mono">— J.R.R. Tolkien</p>
        </div>
        <div className="flex gap-3 text-2xl opacity-50">
          {['🗺️','📍','✈️','🌍','♥'].map((e, i) => <span key={i}>{e}</span>)}
        </div>
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

          <h1 className="font-display text-3xl font-bold mb-1">Welcome back</h1>
          <p className="text-ink/50 text-sm mb-8">Your map is waiting for you</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-ink/45 uppercase tracking-widest block mb-1.5">Email or username</label>
              <input type="text" value={form.emailOrUsername}
                onChange={e => setForm(f => ({...f, emailOrUsername: e.target.value}))}
                className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-xs font-mono text-ink/45 uppercase tracking-widest block mb-1.5">Password</label>
              <input type="password" value={form.password}
                onChange={e => setForm(f => ({...f, password: e.target.value}))}
                className="input-field" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-ink/50 mt-6">
            No account?{' '}
            <Link to="/register" className="text-terracotta font-medium hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
