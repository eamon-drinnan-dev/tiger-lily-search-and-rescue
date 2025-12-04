import type { Zone, ID } from '../tiger-lily-types';
import { mockZones } from './db';

/**
 * Zones Repository
 * @description In-memory CRUD operations for zone entities using Map
 */

export function getAllZones(): Zone[] {
  return Array.from(mockZones.values());
}

export function getZoneById(id: ID): Zone | undefined {
  return mockZones.get(id);
}

export function createZone(zone: Zone): Zone {
  mockZones.set(zone.id, zone);
  return zone;
}

export function updateZone(id: ID, updates: Partial<Omit<Zone, 'id' | 'kind'>>): Zone | undefined {
  const existing = mockZones.get(id);
  if (!existing) {
    return undefined;
  }

  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockZones.set(id, updated);
  return updated;
}

export function deleteZone(id: ID): boolean {
  return mockZones.delete(id);
}
