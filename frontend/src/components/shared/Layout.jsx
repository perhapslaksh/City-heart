import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Map, Compass, Heart, Settings, LogOut, Plus, Search } from 'lucide-react';
import { useAuthStore } from '../../context/authStore';
import toast from 'react-hot-toast';
import AddPlaceModal from '../places/AddPlaceModal';
import NotificationsBell from './NotificationsBell';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('See you soon ✈️');
  };

  const nav = [
    { to: '/map',     icon: Map,     label: 'My Map' },
    { to: '/feed',    icon: Heart,   label: 'Feed' },
    { to: '/explore', icon: Compass, label: 'Explore' },
  ];

  return (
    <div className="flex h-screen bg-paper overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 lg:w-52 flex flex-col border-r border-sand/60 bg-paper flex-shrink-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 lg:px-4 py-5">
          <div className="w-8 h-8 bg-ink rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-paper text-sm font-bold">♥</span>
          </div>
          <span className="font-display text-lg font-semibold text-ink hidden lg:block">CityHeart</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 space-y-1">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${isActive ? 'bg-ink text-paper' : 'text-ink/60 hover:bg-cream hover:text-ink'}`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="hidden lg:block">{label}</span>
            </NavLink>
          ))}

          {user && (
            <button onClick={() => setAddOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-terracotta hover:bg-terracotta/10 transition-all text-sm font-medium mt-1"
            >
              <Plus size={18} className="flex-shrink-0" />
              <span className="hidden lg:block">Add Place</span>
            </button>
          )}
        </nav>

        {/* Bottom */}
        <div className="border-t border-sand/60 p-2 space-y-1">
          {user ? (
            <>
              <div className="hidden lg:block px-1 py-1">
                <NotificationsBell />
              </div>
              <NavLink to={`/${user.username}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${isActive ? 'bg-ink text-paper' : 'text-ink/60 hover:bg-cream hover:text-ink'}`
                }
              >
                {user.avatar
                  ? <img src={user.avatar} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                  : <div className="w-5 h-5 rounded-full bg-terracotta/20 flex items-center justify-center flex-shrink-0"><span className="text-xs text-terracotta font-bold">{user.username?.[0]?.toUpperCase()}</span></div>
                }
                <span className="hidden lg:block truncate">{user.username}</span>
              </NavLink>
              <NavLink to="/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${isActive ? 'bg-ink text-paper' : 'text-ink/50 hover:bg-cream hover:text-ink'}`
                }
              >
                <Settings size={16} className="flex-shrink-0" />
                <span className="hidden lg:block">Settings</span>
              </NavLink>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink/40 hover:text-pin hover:bg-pin/5 transition-all text-sm"
              >
                <LogOut size={16} className="flex-shrink-0" />
                <span className="hidden lg:block">Log out</span>
              </button>
            </>
          ) : (
            <NavLink to="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink/60 hover:bg-cream hover:text-ink transition-all text-sm"
            >
              <Search size={16} />
              <span className="hidden lg:block">Sign in</span>
            </NavLink>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {addOpen && <AddPlaceModal onClose={() => setAddOpen(false)} />}
    </div>
  );
}
