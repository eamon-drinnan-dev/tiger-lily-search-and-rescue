import type { K9Unit, ID } from '../tiger-lily-types';
import { mockK9Units } from './db';

/**
 * K9 Repository
 * @description In-memory CRUD operations for K9 unit entities using objects
 */

export function getAllK9Units(): K9Unit[] {
  return Object.values(mockK9Units);
}

export function getK9UnitById(id: ID): K9Unit | undefined {
  return mockK9Units[id];
}

export function createK9Unit(k9: K9Unit): K9Unit {
  mockK9Units[k9.id] = k9;
  return k9;
}

export function updateK9Unit(id: ID, updates: Partial<Omit<K9Unit, 'id' | 'kind'>>): K9Unit | undefined {
  const existing = mockK9Units[id];
  if (!existing) {
    return undefined;
  }

  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockK9Units[id] = updated;
  return updated;
}

export function deleteK9Unit(id: ID): boolean {
  if (!mockK9Units[id]) return false;
  delete mockK9Units[id];
  return true;
}
