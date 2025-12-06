/**
 * Mission Slice
 * @description Manages active mission state including AOI (Area of Interest)
 */

import type { StateCreator } from 'zustand';
import type { Mission } from '../tiger-lily-types/index';

export interface MissionSlice {
  activeMission: Mission | null;
  setActiveMission: (mission: Mission | null) => void;
  clearActiveMission: () => void;
}

export const createMissionSlice: StateCreator<
  MissionSlice,
  [],
  [],
  MissionSlice
> = (set) => ({
  activeMission: null,

  setActiveMission: (mission) => set({ activeMission: mission }),

  clearActiveMission: () => set({ activeMission: null }),
});
