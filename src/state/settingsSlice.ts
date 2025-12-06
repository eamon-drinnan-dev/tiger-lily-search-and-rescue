/**
 * Settings Slice
 * @description Manages user preferences including saved default map view
 */

import type { StateCreator } from 'zustand';
import { ThemeModes, type ThemeMode } from '../lib/constants';

export interface MapDefaultView {
  center: { lat: number; lon: number };
  height: number;
  heading?: number;
  pitch?: number;
  roll?: number;
}

export interface SettingsSlice {
  mapDefault: MapDefaultView | null;
  themeMode: ThemeMode;

  // Actions
  setMapDefault: (view: MapDefaultView | null) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const createSettingsSlice: StateCreator<
  SettingsSlice,
  [],
  [],
  SettingsSlice
> = (set) => ({
  mapDefault: null,
  themeMode: ThemeModes.LIGHT,

  setMapDefault: (view) => set({ mapDefault: view }),
  setThemeMode: (mode) => set({ themeMode: mode }),
});
