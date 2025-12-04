import type { Responder, ID } from '../tiger-lily-types';
import { mockResponders } from './db';

/**
 * Responders Repository
 * @description In-memory CRUD operations for responder entities using Map
 */

export function getAllResponders(): Responder[] {
  return Array.from(mockResponders.values());
}

export function getResponderById(id: ID): Responder | undefined {
  return mockResponders.get(id);
}

export function createResponder(responder: Responder): Responder {
  mockResponders.set(responder.id, responder);
  return responder;
}

export function updateResponder(id: ID, updates: Partial<Omit<Responder, 'id' | 'kind'>>): Responder | undefined {
  const existing = mockResponders.get(id);
  if (!existing) {
    return undefined;
  }

  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockResponders.set(id, updated);
  return updated;
}

export function deleteResponder(id: ID): boolean {
  return mockResponders.delete(id);
}
