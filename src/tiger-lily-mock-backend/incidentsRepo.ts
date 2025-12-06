import type { Incident, ID } from '../tiger-lily-types';
import { mockIncidents } from './db';

/**
 * Incidents Repository
 * @description In-memory CRUD operations for incident entities using objects
 */

export function getAllIncidents(): Incident[] {
  return Object.values(mockIncidents);
}

export function getIncidentById(id: ID): Incident | undefined {
  return mockIncidents[id];
}

export function createIncident(incident: Incident): Incident {
  mockIncidents[incident.id] = incident;
  return incident;
}

export function updateIncident(id: ID, updates: Partial<Omit<Incident, 'id' | 'kind'>>): Incident | undefined {
  const existing = mockIncidents[id];
  if (!existing) {
    return undefined;
  }

  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockIncidents[id] = updated;
  return updated;
}

export function deleteIncident(id: ID): boolean {
  if (!mockIncidents[id]) return false;
  delete mockIncidents[id];
  return true;
}
