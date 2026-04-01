import { create } from 'zustand';

export const useMapStore = create((set) => ({
  viewport: { longitude: 20, latitude: 20, zoom: 2 },
  selectedBookmark: null,
  setViewport: (v) => set({ viewport: v }),
  flyTo: (lng, lat, zoom = 14) => set({ viewport: { longitude: lng, latitude: lat, zoom } }),
  selectBookmark: (b) => set({ selectedBookmark: b }),
  clearSelection: () => set({ selectedBookmark: null }),
}));
