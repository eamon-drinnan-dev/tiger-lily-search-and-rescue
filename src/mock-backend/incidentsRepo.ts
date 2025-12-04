import type { Incident, ID } from '../tiger-lily-types';
import { mockIncidents } from './db';

/**
 * Incidents Repository
 * @description In-memory CRUD operations for incident entities using Map
 */

export function getAllIncidents(): Incident[] {
  return Array.from(mockIncidents.values());
}

export function getIncidentById(id: ID): Incident | undefined {
  return mockIncidents.get(id);
}

export function createIncident(incident: Incident): Incident {
  mockIncidents.set(incident.id, incident);
  return incident;
}

export function updateIncident(id: ID, updates: Partial<Omit<Incident, 'id' | 'kind'>>): Incident | undefined {
  const existing = mockIncidents.get(id);
  if (!existing) {
    return undefined;
  }

  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockIncidents.set(id, updated);
  return updated;
}

export function deleteIncident(id: ID): boolean {
  return mockIncidents.delete(id);
}
