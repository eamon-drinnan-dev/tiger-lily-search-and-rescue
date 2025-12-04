/**
 * Settings Slice
 * @description Manages user preferences including saved default map view
 */

import type { StateCreator } from 'zustand';

export interface MapDefaultView {
  center: { lat: number; lon: number };
  height: number;
  heading?: number;
  pitch?: number;
  roll?: number;
}

export interface SettingsSlice {
  mapDefault: MapDefaultView | null;
  themeMode: 'light' | 'dark';

  // Actions
  setMapDefault: (view: MapDefaultView | null) => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
}

export const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  mapDefault: null,
  themeMode: 'light',

  setMapDefault: (view) => set({ mapDefault: view }),
  setThemeMode: (mode) => set({ themeMode: mode }),
});
