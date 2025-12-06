import type { Drone, ID } from '../tiger-lily-types';
import { mockDrones } from './db';

/**
 * Drones Repository
 * @description In-memory CRUD operations for drone entities using objects
 */

export function getAllDrones(): Drone[] {
  return Object.values(mockDrones);
}

export function getDroneById(id: ID): Drone | undefined {
  return mockDrones[id];
}

export function createDrone(drone: Drone): Drone {
  mockDrones[drone.id] = drone;
  return drone;
}

export function updateDrone(id: ID, updates: Partial<Omit<Drone, 'id' | 'kind'>>): Drone | undefined {
  const existing = mockDrones[id];
  if (!existing) {
    return undefined;
  }

  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockDrones[id] = updated;
  return updated;
}

export function deleteDrone(id: ID): boolean {
  if (!mockDrones[id]) return false;
  delete mockDrones[id];
  return true;
}
