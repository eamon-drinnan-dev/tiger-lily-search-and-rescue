/**
 * Mission Slice
 * @description Manages active mission state including AOI (Area of Interest)
 */

import type { StateCreator } from 'zustand';

export interface MissionAOI {
  center: { lat: number; lon: number };
  radiusMeters: number;
}

export interface Mission {
  id: string;
  name: string;
  aoi?: MissionAOI;
  status: 'active' | 'planning' | 'completed';
  createdAt: string;
}

export interface MissionSlice {
  activeMission: Mission | null;
  setActiveMission: (mission: Mission | null) => void;
  clearActiveMission: () => void;
}

export const createMissionSlice: StateCreator<MissionSlice> = (set) => ({
  activeMission: null,

  setActiveMission: (mission) => set({ activeMission: mission }),

  clearActiveMission: () => set({ activeMission: null }),
});
