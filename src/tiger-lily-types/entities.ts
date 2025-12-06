/**
 * Entity Types
 *
 * Domain entities for Tiger Lily SAR operations:
 * - Drones (UAS)
 * - K9 Units
 * - Responders (ground teams, command, medics, logistics)
 * - Incidents (markers, clues, evidence)
 * - Zones (search areas, hazards, no-fly zones)
 */

import type { ID, LatLonAlt, Timestamped } from './primitives';

// ─────────────────────────────────────────────────────────
// Entity Kinds
// ─────────────────────────────────────────────────────────

export const EntityKinds = {
  DRONE: 'drone',
  K9: 'k9',
  RESPONDER: 'responder',
  INCIDENT: 'incident',
  ZONE: 'zone',
} as const;

export type EntityKind = typeof EntityKinds[keyof typeof EntityKinds];

// ─────────────────────────────────────────────────────────
// Base Entity
// ─────────────────────────────────────────────────────────

export interface BaseEntity extends Timestamped {
  id: ID;
  kind: EntityKind;
  label: string;      // Operator-facing display name
  notes?: string;
}

// ─────────────────────────────────────────────────────────
// Drones
// ─────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────
// K9 Units
// ─────────────────────────────────────────────────────────

export const K9Statuses = {
  OFF_DUTY: 'off_duty',
  EN_ROUTE: 'en_route',
  SEARCHING: 'searching',
  RESTING: 'resting',
  RETURNING: 'returning',
} as const;

export type K9Status = typeof K9Statuses[keyof typeof K9Statuses];

export const K9Capabilities = {
  TRAILING: 'trailing',
  AIRSCENT: 'airscent',
  CADAVER: 'cadaver',
} as const;

export type K9Capability = typeof K9Capabilities[keyof typeof K9Capabilities];

export interface K9Unit extends BaseEntity {
  kind: 'k9';
  dogName: string;
  handlerName: string;
  status: K9Status;
  lastKnownPosition: LatLonAlt;
  lastScentEventId?: ID;
  capabilities?: K9Capability[];
}

// ─────────────────────────────────────────────────────────
// Responders
// ─────────────────────────────────────────────────────────

export const ResponderRoles = {
  GROUND_TEAM: 'ground_team',
  COMMAND: 'command',
  MEDIC: 'medic',
  LOGISTICS: 'logistics',
} as const;

export type ResponderRole = typeof ResponderRoles[keyof typeof ResponderRoles];

export interface Responder extends BaseEntity {
  kind: 'responder';
  role: ResponderRole;
  teamName?: string;
  lastKnownPosition?: LatLonAlt;
  isInField: boolean;
}

// ─────────────────────────────────────────────────────────
// Incidents
// ─────────────────────────────────────────────────────────

export const IncidentTypes = {
  LAST_KNOWN_POSITION: 'last_known_position',
  CLUE: 'clue',
  SIGHTING: 'sighting',
  EVIDENCE: 'evidence',
  NOTE: 'note',
} as const;

export type IncidentType = typeof IncidentTypes[keyof typeof IncidentTypes];

export const Severities = {
  INFO: 'info',
  MINOR: 'minor',
  MAJOR: 'major',
  CRITICAL: 'critical',
} as const;

export type Severity = typeof Severities[keyof typeof Severities];

export interface Incident extends BaseEntity {
  kind: 'incident';
  incidentType: IncidentType;
  severity: Severity;
  position: LatLonAlt;
  relatedEntityIds?: ID[]; // References to drones, k9s, responders, zones
}

// ─────────────────────────────────────────────────────────
// Zones
// ─────────────────────────────────────────────────────────

export interface Polygon {
  vertices: LatLonAlt[];
}

export const ZoneTypes = {
  SEARCH_AREA: 'search_area',
  SCENT_ZONE: 'scent_zone',
  HAZARD: 'hazard',
  STAGING: 'staging',
  NO_FLY: 'no_fly',
} as const;

export type ZoneType = typeof ZoneTypes[keyof typeof ZoneTypes];

export const ScentTypes = {
  AIRSCENT: 'airscent',
  TRAILING: 'trailing',
  CADAVER: 'cadaver',
  UNKNOWN: 'unknown',
} as const;

export type ScentType = typeof ScentTypes[keyof typeof ScentTypes];

export const ScentConfidences = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type ScentConfidence = typeof ScentConfidences[keyof typeof ScentConfidences];

/**
 * Scent zone metadata (v1: stored directly on Zone when zoneType === 'scent_zone')
 */
export interface ScentZoneMeta {
  k9Id: ID;
  scentType: ScentType;
  confidence: ScentConfidence;
  firstDetectedAt: string; // ISO 8601
}

export interface Zone extends BaseEntity {
  kind: 'zone';
  zoneType: ZoneType;
  geometry: Polygon;
  altitudeFloorMeters?: number;
  altitudeCeilingMeters?: number;
  active: boolean;
  scentMeta?: ScentZoneMeta; // Only present when zoneType === 'scent_zone'
}

// ─────────────────────────────────────────────────────────
// Missions
// ─────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────
// Union Type for All Entities
// ─────────────────────────────────────────────────────────

export type Entity = Drone | K9Unit | Responder | Incident | Zone;
