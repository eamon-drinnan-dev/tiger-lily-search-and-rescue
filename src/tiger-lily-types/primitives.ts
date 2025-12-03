/**
 * Primitive Types
 *
 * Base types used across the Tiger Lily SAR application.
 */

/**
 * Unique identifier - uses UUID v4 format
 * Generate with: import { v4 as uuidv4 } from 'uuid';
 */
export type ID = string;

/**
 * Latitude and longitude coordinates
 */
export interface LatLon {
  lat: number;
  lon: number;
}

/**
 * Latitude, longitude, and optional altitude in meters
 */
export interface LatLonAlt extends LatLon {
  altMeters?: number;
}

/**
 * Timestamp mixin for entities with creation/update times
 */
export interface Timestamped {
  createdAt: string;   // ISO 8601
  updatedAt?: string;  // ISO 8601
}
