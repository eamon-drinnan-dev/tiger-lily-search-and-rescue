/**
 * ID Generation Utilities
 *
 * Uses UUID v4 for unique identifier generation.
 */

import { v4 as uuidv4 } from 'uuid';
import type { ID } from '../tiger-lily-types';

/**
 * Generate a new unique ID (UUID v4)
 *
 * @returns A new UUID v4 string
 *
 * @example
 * const droneId = generateId();
 * const zoneId = generateId();
 */
export function generateId(): ID {
  return uuidv4();
}

/**
 * Validate if a string is a valid UUID v4
 *
 * @param id - The ID to validate
 * @returns True if the ID is a valid UUID v4
 *
 * @example
 * isValidId('550e8400-e29b-41d4-a716-446655440000'); // true
 * isValidId('invalid-id'); // false
 */
export function isValidId(id: string): boolean {
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(id);
}
