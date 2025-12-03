/**
 * Tiger Lily SAR - Type Definitions
 *
 * Barrel export for all domain types.
 *
 * @example
 * import { Drone, DroneStatuses, generateId } from '@/types';
 */

// Primitives
export type { ID, LatLon, LatLonAlt, Timestamped } from './primitives';

// Entities - Base
export type { BaseEntity, EntityKind, Entity } from './entities';
export { EntityKinds } from './entities';

// Entities - Drones
export type { Drone, DroneStatus } from './entities';
export { DroneStatuses } from './entities';

// Entities - K9 Units
export type { K9Unit, K9Status, K9Capability } from './entities';
export { K9Statuses, K9Capabilities } from './entities';

// Entities - Responders
export type { Responder, ResponderRole } from './entities';
export { ResponderRoles } from './entities';

// Entities - Incidents
export type { Incident, IncidentType, Severity } from './entities';
export { IncidentTypes, Severities } from './entities';

// Entities - Zones
export type {
  Zone,
  ZoneType,
  Polygon,
  ScentZoneMeta,
  ScentType,
  ScentConfidence,
} from './entities';
export { ZoneTypes, ScentTypes, ScentConfidences } from './entities';
