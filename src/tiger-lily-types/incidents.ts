
// ─────────────────────────────────────────────────────────
// Incidents
// ─────────────────────────────────────────────────────────

import { BaseEntity } from "./entities";
import { ID, LatLonAlt } from "./primitives";

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
  reportedByResponderId?: ID; // References Responder.id
  relatedEntityIds?: ID[]; // References to drones, k9s, responders, zones
}