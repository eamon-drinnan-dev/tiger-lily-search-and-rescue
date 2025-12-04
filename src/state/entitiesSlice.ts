/**
 * Entities Slice
 * @description Manages drones, K9 units, responders, incidents, and zones
 */

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

  // Derived getters
  getAllActiveEntities: () => Entity[];
}

export const createEntitiesSlice: StateCreator<EntitiesSlice> = (set, get) => ({
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

  updateDrone: (id, drone) =>
    set((state) => {
      const newDrones = new Map(state.drones);
      newDrones.set(id, drone);
      return { drones: newDrones };
    }),

  updateK9Unit: (id, k9) =>
    set((state) => {
      const newK9Units = new Map(state.k9Units);
      newK9Units.set(id, k9);
      return { k9Units: newK9Units };
    }),

  updateResponder: (id, responder) =>
    set((state) => {
      const newResponders = new Map(state.responders);
      newResponders.set(id, responder);
      return { responders: newResponders };
    }),

  getAllActiveEntities: () => {
    const state = get();
    const entities: Entity[] = [];

    state.drones.forEach((drone) => entities.push(drone));
    state.k9Units.forEach((k9) => entities.push(k9));
    state.responders.forEach((responder) => entities.push(responder));

    return entities;
  },
});
