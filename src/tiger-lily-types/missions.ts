// ─────────────────────────────────────────────────────────
// Missions
// ─────────────────────────────────────────────────────────

import { ID } from "./primitives";

export const MissionStatuses = {
  ACTIVE: 'active',
  PLANNING: 'planning',
  COMPLETED: 'completed',
} as const;

export type MissionStatus = typeof MissionStatuses[keyof typeof MissionStatuses];

export interface MissionAOI {
  center: { lat: number; lon: number };
  radiusMeters: number;
}

export interface Mission {
  id: ID;
  name: string;
  aoi?: MissionAOI;
  status: MissionStatus;
  createdAt: string;
}