// ─────────────────────────────────────────────────────────
// Zones
// ─────────────────────────────────────────────────────────

import { BaseEntity } from "./entities";
import { ID, LatLonAlt } from "./primitives";

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
  createdByResponderId?: ID; // References Responder.id
  scentMeta?: ScentZoneMeta; // Only present when zoneType === 'scent_zone'
}