/**
 * Zustand Store
 * @description Combined store with all state slices
 * @note Immer is used selectively within entitiesSlice for Map CRUD operations
 */

import { create } from 'zustand';
import { createMissionSlice, type MissionSlice } from './missionSlice';
import { createEntitiesSlice, type EntitiesSlice } from './entitiesSlice';
import { createSettingsSlice, type SettingsSlice } from './settingsSlice';

export type AppState = MissionSlice & EntitiesSlice & SettingsSlice;

export const useStore = create<AppState>()((...args) => ({
  ...createMissionSlice(...args),
  ...createEntitiesSlice(...args),
  ...createSettingsSlice(...args),
}));
