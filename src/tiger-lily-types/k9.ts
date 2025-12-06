// ─────────────────────────────────────────────────────────
// K9 Units
// ─────────────────────────────────────────────────────────

import { BaseEntity } from "./entities";
import { ID, LatLonAlt } from "./primitives";

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
  handlerId?: ID,  // links to a Responder with role='k9_handler'
  status: K9Status;
  lastKnownPosition: LatLonAlt;
  lastScentEventId?: ID;
  capabilities?: K9Capability[];
}