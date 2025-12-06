import type { Zone, ID } from '../tiger-lily-types';
import { mockZones } from './db';

/**
 * Zones Repository
 * @description In-memory CRUD operations for zone entities using objects
 */

export function getAllZones(): Zone[] {
  return Object.values(mockZones);
}

export function getZoneById(id: ID): Zone | undefined {
  return mockZones[id];
}

export function createZone(zone: Zone): Zone {
  mockZones[zone.id] = zone;
  return zone;
}

export function updateZone(id: ID, updates: Partial<Omit<Zone, 'id' | 'kind'>>): Zone | undefined {
  const existing = mockZones[id];
  if (!existing) {
    return undefined;
  }

  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockZones[id] = updated;
  return updated;
}

export function deleteZone(id: ID): boolean {
  if (!mockZones[id]) return false;
  delete mockZones[id];
  return true;
}
