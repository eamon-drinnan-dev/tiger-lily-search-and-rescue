import type { Responder, ID } from '../tiger-lily-types';
import { mockResponders } from './db';

/**
 * Responders Repository
 * @description In-memory CRUD operations for responder entities using objects
 */

export function getAllResponders(): Responder[] {
  return Object.values(mockResponders);
}

export function getResponderById(id: ID): Responder | undefined {
  return mockResponders[id];
}

export function createResponder(responder: Responder): Responder {
  mockResponders[responder.id] = responder;
  return responder;
}

export function updateResponder(id: ID, updates: Partial<Omit<Responder, 'id' | 'kind'>>): Responder | undefined {
  const existing = mockResponders[id];
  if (!existing) {
    return undefined;
  }

  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockResponders[id] = updated;
  return updated;
}

export function deleteResponder(id: ID): boolean {
  if (!mockResponders[id]) return false;
  delete mockResponders[id];
  return true;
}
