/**
 * State Selectors
 * @description Derived state and consolidation logic for UI-ready data shapes
 */

import type { MissionSlice } from './missionSlice';
import type { EntitiesSlice } from './entitiesSlice';
import type { SettingsSlice, MapDefaultView } from './settingsSlice';
import type { Entity, MissionAOI } from '../tiger-lily-types/index';

export type CombinedState = MissionSlice & EntitiesSlice & SettingsSlice;

// Map Initial View Types (constants for type discrimination)
export const MapInitialViewTypes = {
  MISSION_AOI: 'mission-aoi',
  FIT_ENTITIES: 'fit-entities',
  SAVED_DEFAULT: 'saved-default',
  PROMPT_USER: 'prompt-user',
} as const;

export type MapInitialViewType = typeof MapInitialViewTypes[keyof typeof MapInitialViewTypes];

export type MapInitialView =
  | { type: typeof MapInitialViewTypes.MISSION_AOI; aoi: MissionAOI }
  | { type: typeof MapInitialViewTypes.FIT_ENTITIES; entities: Entity[] }
  | { type: typeof MapInitialViewTypes.SAVED_DEFAULT; view: MapDefaultView }
  | { type: typeof MapInitialViewTypes.PROMPT_USER };

/**
 * Selects the initial map view based on priority chain:
 * 1. Active mission AOI exists → flyToBoundingSphere(missionAOI)
 * 2. No mission but entities exist → fitToEntities(drones + k9 + responders)
 * 3. No entities but saved default → camera.setView(savedDefault)
 * 4. No default → prompt user to select
 */
export function selectMapInitialView(state: CombinedState): MapInitialView {
  // Priority 1: Active mission with AOI
  if (state.activeMission?.aoi) {
    return {
      type: MapInitialViewTypes.MISSION_AOI,
      aoi: state.activeMission.aoi,
    };
  }

  // Priority 2: Entities exist (drones, K9s, responders)
  const entities = state.getAllActiveEntities();
  if (entities.length > 0) {
    return {
      type: MapInitialViewTypes.FIT_ENTITIES,
      entities,
    };
  }

  // Priority 3: Saved default view
  if (state.mapDefault) {
    return {
      type: MapInitialViewTypes.SAVED_DEFAULT,
      view: state.mapDefault,
    };
  }

  // Priority 4: No data, prompt user
  return {
    type: MapInitialViewTypes.PROMPT_USER,
  };
}
