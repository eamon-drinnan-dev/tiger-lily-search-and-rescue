
// ─────────────────────────────────────────────────────────
// Responders
// ─────────────────────────────────────────────────────────

import { BaseEntity } from "./entities";
import { LatLonAlt } from "./primitives";

export const ResponderRoles = {
  GROUND_TEAM: 'ground_team',
  COMMAND: 'command',
  MEDIC: 'medic',
  LOGISTICS: 'logistics',
  K9Handler: 'k9_handler'
} as const;

export type ResponderRole = typeof ResponderRoles[keyof typeof ResponderRoles];

export interface Responder extends BaseEntity {
  kind: 'responder';
  role: ResponderRole;
  teamName?: string;
  lastKnownPosition?: LatLonAlt;
  isInField: boolean;
}