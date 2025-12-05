/**
 * Entities Slice
 * @description Manages drones, K9 units, responders, incidents, and zones
 * @note Uses Immer's produce() for Map CRUD operations - write mutable code, get immutable updates
 */

import { produce } from 'immer';
import type { StateCreator } from 'zustand';
import type { Drone, K9Unit, Responder, Incident, Zone, Entity, ID } from '../tiger-lily-types/index';

export interface EntitiesSlice {
  drones: Map<ID, Drone>;
  k9Units: Map<ID, K9Unit>;
  responders: Map<ID, Responder>;
  incidents: Map<ID, Incident>;
  zones: Map<ID, Zone>;

  // Actions
  setDrones: (drones: Map<ID, Drone>) => void;
  setK9Units: (k9Units: Map<ID, K9Unit>) => void;
  setResponders: (responders: Map<ID, Responder>) => void;
  setIncidents: (incidents: Map<ID, Incident>) => void;
  setZones: (zones: Map<ID, Zone>) => void;

  updateDrone: (id: ID, drone: Drone) => void;
  updateK9Unit: (id: ID, k9: K9Unit) => void;
  updateResponder: (id: ID, responder: Responder) => void;

  deleteDrone: (id: ID) => void;
  deleteK9Unit: (id: ID) => void;
  deleteResponder: (id: ID) => void;
  deleteIncident: (id: ID) => void;
  deleteZone: (id: ID) => void;

  // Derived getters
  getAllActiveEntities: () => Entity[];
}

export const createEntitiesSlice: StateCreator<
  EntitiesSlice,
  [],
  [],
  EntitiesSlice
> = (set, get) => ({
  drones: new Map(),
  k9Units: new Map(),
  responders: new Map(),
  incidents: new Map(),
  zones: new Map(),

  setDrones: (drones) => set({ drones }),
  setK9Units: (k9Units) => set({ k9Units }),
  setResponders: (responders) => set({ responders }),
  setIncidents: (incidents) => set({ incidents }),
  setZones: (zones) => set({ zones }),

  // Immer's produce() wraps mutations - write mutable code, get immutable state
  updateDrone: (id, drone) =>
    set(
      produce((state) => {
        state.drones.set(id, drone);
      })
    ),

  updateK9Unit: (id, k9) =>
    set(
      produce((state) => {
        state.k9Units.set(id, k9);
      })
    ),

  updateResponder: (id, responder) =>
    set(
      produce((state) => {
        state.responders.set(id, responder);
      })
    ),

  deleteDrone: (id) =>
    set(
      produce((state) => {
        state.drones.delete(id);
      })
    ),

  deleteK9Unit: (id) =>
    set(
      produce((state) => {
        state.k9Units.delete(id);
      })
    ),

  deleteResponder: (id) =>
    set(
      produce((state) => {
        state.responders.delete(id);
      })
    ),

  deleteIncident: (id) =>
    set(
      produce((state) => {
        state.incidents.delete(id);
      })
    ),

  deleteZone: (id) =>
    set(
      produce((state) => {
        state.zones.delete(id);
      })
    ),

  getAllActiveEntities: () => {
    const state = get();
    const entities: Entity[] = [];

    state.drones.forEach((drone) => entities.push(drone));
    state.k9Units.forEach((k9) => entities.push(k9));
    state.responders.forEach((responder) => entities.push(responder));

    return entities;
  },
});
