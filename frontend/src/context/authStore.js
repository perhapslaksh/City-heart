import { create } from 'zustand';
import api from '../utils/api';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  init: async () => {
    const token = localStorage.getItem('ch_token');
    if (!token) { set({ loading: false }); return; }
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, loading: false });
    } catch {
      localStorage.removeItem('ch_token');
      set({ user: null, loading: false });
    }
  },

  login: async (emailOrUsername, password) => {
    const { data } = await api.post('/auth/login', { emailOrUsername, password });
    localStorage.setItem('ch_token', data.token);
    set({ user: data.user });
    return data.user;
  },

  register: async (username, email, password, displayName) => {
  try {
    const { data } = await api.post('/auth/register', { username, email, password, displayName });
    localStorage.setItem('ch_token', data.token);
    set({ user: data.user });
    return data.user;
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    throw error;
  }
},

  logout: async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('ch_token');
    set({ user: null });
  },

  updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),
}));
