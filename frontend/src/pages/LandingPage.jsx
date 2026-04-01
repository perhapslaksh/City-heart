import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

const PINS = [
  { top:'16%', left:'20%', label:'Café de Flore', city:'Paris',    emoji:'☕', rating:5, bg:'#C4664A' },
  { top:'30%', left:'65%', label:'Sensoji Temple', city:'Tokyo',    emoji:'⛩️', rating:5, bg:'#E84545' },
  { top:'55%', left:'14%', label:'Brooklyn Bridge',city:'New York', emoji:'🌉', rating:4, bg:'#C9993A' },
  { top:'42%', left:'43%', label:'Trevi Fountain', city:'Rome',     emoji:'⛲', rating:5, bg:'#6B8C6E' },
  { top:'68%', left:'57%', label:'Blue City',      city:'Jodhpur',  emoji:'🏛️', rating:5, bg:'#7B6EA0' },
  { top:'22%', left:'82%', label:'Shibuya',        city:'Tokyo',    emoji:'🚦', rating:4, bg:'#C4664A' },
  { top:'62%', left:'28%', label:'Lapa Steps',     city:'Rio',      emoji:'🎨', rating:5, bg:'#E84545' },
];

const FEATURES = [
  { icon:'📍', title:'Personal world map',      desc:'Drop pins anywhere on earth. Heart, bookmark, mark visited or dream.' },
  { icon:'✍️', title:'Letterboxd-style reviews', desc:'Star ratings, written reviews, custom tags — for every place you visit.' },
  { icon:'📋', title:'Custom lists',             desc:'"My Delhi Cafes", "2026 Europe Trip" — curate and share your guides.' },
  { icon:'👥', title:'Follow friends',           desc:'See where your people are going. Discover places through trusted eyes.' },
  { icon:'🏙️', title:'City community pages',    desc:'Trending spots, top lists, and fresh reviews for every city.' },
  { icon:'🔒', title:'Public or private',        desc:'Your map, your rules. Go public or keep it just for you.' },
];

export default function LandingPage() {
  const { user } = useAuthStore();
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    PINS.forEach((_, i) => setTimeout(() => setVisible(v => [...v, i]), 250 + i * 160));
  }, []);

  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-sand/30 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-ink rounded-xl flex items-center justify-center">
            <span className="text-paper text-sm font-bold">♥</span>
          </div>
          <span className="font-display text-xl font-semibold">CityHeart</span>
        </div>
        <div className="flex items-center gap-3">
          {user
            ? <Link to="/map" className="btn-primary">Open my map</Link>
            : <><Link to="/login" className="text-sm text-ink/60 hover:text-ink transition-colors hidden sm:block">Sign in</Link>
               <Link to="/register" className="btn-primary">Get started free</Link></>
          }
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0"
          style={{ backgroundImage:'linear-gradient(rgba(212,201,184,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(212,201,184,.25) 1px,transparent 1px)', backgroundSize:'56px 56px' }} />
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at center,transparent 25%,#F9F5EF 75%)' }} />

        {/* Pins */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {PINS.map((p, i) => (
            <div key={i} className="absolute transition-all duration-700 group"
              style={{ top:p.top, left:p.left, opacity:visible.includes(i)?1:0, transform:visible.includes(i)?'translateY(0) scale(1)':'translateY(-20px) scale(0.5)' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg" style={{ background:p.bg }}>
                <span className="text-sm">{p.emoji}</span>
              </div>
              <div className="w-0.5 h-2.5 mx-auto opacity-70" style={{ background:p.bg }} />
              <div className="w-1.5 h-1.5 rounded-full bg-ink/20 mx-auto" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                <div className="glass rounded-xl px-3 py-1.5 text-xs border border-sand/50 shadow-lg">
                  <p className="font-semibold">{p.label}</p>
                  <p className="text-ink/50">{p.city} · {'★'.repeat(p.rating)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-terracotta/30 bg-terracotta/5 text-terracotta text-xs font-mono px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
            Social travel maps for explorers
          </div>
          <h1 className="font-display text-6xl md:text-7xl font-bold text-ink leading-tight mb-6">
            Pin the places<br /><em className="not-italic text-terracotta">you love.</em>
          </h1>
          <p className="text-xl text-ink/55 mb-10 max-w-lg mx-auto leading-relaxed">
            Your personal world map. Write reviews. Build lists. Follow friends.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5">Start mapping — it's free ✈️</Link>
            <Link to="/explore" className="btn-outline text-base px-8 py-3.5">Explore cities</Link>
          </div>
          <p className="text-xs text-ink/30 mt-5 font-mono">No credit card · No ads · Free forever</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-ink">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono text-white/30 text-xs uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
              Your travel life,<br /><em className="not-italic text-terracotta">beautifully organised.</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="rounded-2xl p-6 border border-white/8 bg-white/4 hover:bg-white/7 transition-colors">
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="font-display text-lg font-semibold text-terracotta mb-2">{f.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-terracotta relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'28px 28px' }} />
        <div className="relative max-w-xl mx-auto text-center">
          <h2 className="font-display text-5xl font-bold text-white mb-4 leading-tight">Start mapping<br />your world.</h2>
          <p className="text-white/70 mb-8 text-lg">Free forever. No ads.</p>
          <Link to="/register" className="inline-block bg-white text-ink px-10 py-4 rounded-2xl font-semibold text-base hover:bg-paper transition-colors shadow-xl">
            Create your free map
          </Link>
        </div>
      </section>

      <footer className="py-6 px-6 bg-ink">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-terracotta rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">♥</span>
            </div>
            <span className="text-white/50 font-display text-sm">CityHeart</span>
          </div>
          <p className="text-white/30 text-xs font-mono">Pin the places you love.</p>
        </div>
      </footer>
    </div>
  );
}
