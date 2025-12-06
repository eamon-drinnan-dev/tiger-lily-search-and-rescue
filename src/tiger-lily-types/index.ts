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
export type { Drone, DroneStatus } from './drones';
export { DroneStatuses } from './drones';

// Entities - K9 Units
export type { K9Unit, K9Status, K9Capability } from './k9';
export { K9Statuses, K9Capabilities } from './k9';

// Entities - Responders
export type { Responder, ResponderRole } from './responders';
export { ResponderRoles } from './responders';

// Entities - Incidents
export type { Incident, IncidentType, Severity } from './incidents';
export { IncidentTypes, Severities } from './incidents';

// Entities - Zones
export type {
  Zone,
  ZoneType,
  Polygon,
  ScentZoneMeta,
  ScentType,
  ScentConfidence,
} from './zones';
export { ZoneTypes, ScentTypes, ScentConfidences } from './zones';

// Missions
export type { Mission, MissionStatus, MissionAOI } from './missions';
export { MissionStatuses } from './missions';
