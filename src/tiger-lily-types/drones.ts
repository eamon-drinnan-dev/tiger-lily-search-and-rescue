// ─────────────────────────────────────────────────────────
// Drones
// ─────────────────────────────────────────────────────────

import { BaseEntity } from "./entities";
import { ID, LatLonAlt } from "./primitives";

export const DroneStatuses = {
  IDLE: 'idle',
  PREFLIGHT: 'preflight',
  IN_FLIGHT: 'in_flight',
  HOVER_HOLD: 'hover_hold',
  RETURNING: 'returning',
  CHARGING: 'charging',
  LOST_COMM: 'lost_comm',
} as const;

export type DroneStatus = typeof DroneStatuses[keyof typeof DroneStatuses];

export interface Drone extends BaseEntity {
  kind: 'drone';
  callsign: string;
  model?: string;
  status: DroneStatus;
  position: LatLonAlt;
  headingDeg?: number;
  groundSpeedMps?: number;
  batteryPct?: number;
  linkQualityPct?: number;
  homeLocationId?: ID;
  currentMissionId?: ID;
}