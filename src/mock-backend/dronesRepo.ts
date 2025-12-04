import type { Drone, ID } from '../tiger-lily-types';
import { mockDrones } from './db';

/**
 * Drones Repository
 * @description In-memory CRUD operations for drone entities using Map
 */

export function getAllDrones(): Drone[] {
  return Array.from(mockDrones.values());
}

export function getDroneById(id: ID): Drone | undefined {
  return mockDrones.get(id);
}

export function createDrone(drone: Drone): Drone {
  mockDrones.set(drone.id, drone);
  return drone;
}

export function updateDrone(id: ID, updates: Partial<Omit<Drone, 'id' | 'kind'>>): Drone | undefined {
  const existing = mockDrones.get(id);
  if (!existing) {
    return undefined;
  }

  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockDrones.set(id, updated);
  return updated;
}

export function deleteDrone(id: ID): boolean {
  return mockDrones.delete(id);
}
