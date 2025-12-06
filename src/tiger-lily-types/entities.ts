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

import type { ID, Timestamped } from './primitives';
import type { Drone } from './drones';
import type { K9Unit } from './k9';
import type { Responder } from './responders';
import type { Incident } from './incidents';
import type { Zone } from './zones';

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
// Union Type for All Entities
// ─────────────────────────────────────────────────────────

export type Entity = Drone | K9Unit | Responder | Incident | Zone;
