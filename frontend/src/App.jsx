import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './context/authStore';

import Layout      from './components/shared/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage   from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapPage     from './pages/MapPage';
import FeedPage    from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import CityPage    from './pages/CityPage';
import ListPage    from './pages/ListPage';
import SettingsPage from './pages/SettingsPage';

function Loader() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#F9F5EF' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🗺️</div>
        <p style={{ fontFamily:'Playfair Display,serif', fontSize:20, color:'#0D0B0A', opacity:.5 }}>CityHeart</p>
      </div>
    </div>
  );
}

function Protected({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { init, loading } = useAuthStore();
  useEffect(() => { init(); }, [init]);
  if (loading) return <Loader />;

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background:'#0D0B0A', color:'#F9F5EF', fontFamily:'DM Sans,sans-serif', fontSize:14, borderRadius:100, padding:'10px 20px' },
          success: { iconTheme: { primary:'#6B8C6E', secondary:'#F9F5EF' } },
          error:   { iconTheme: { primary:'#E84545', secondary:'#F9F5EF' } },
        }}
      />
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route element={<Layout />}>
          <Route path="/map"          element={<Protected><MapPage /></Protected>} />
          <Route path="/feed"         element={<Protected><FeedPage /></Protected>} />
          <Route path="/settings"     element={<Protected><SettingsPage /></Protected>} />
          <Route path="/explore"      element={<ExplorePage />} />
          <Route path="/city/:city"   element={<CityPage />} />
          <Route path="/list/:id"     element={<ListPage />} />
          <Route path="/:username"    element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
