/**
 * useMapInitialView Hook
 * @description Facade hook for map initial view logic. Components use this instead of directly accessing the store.
 * @example
 * const mapInitialView = useMapInitialView();
 * if (mapInitialView.type === 'mission-aoi') {
 *   viewer.camera.flyToBoundingSphere(...);
 * }
 */

import { useStore } from '../state/store';
import { selectMapInitialView, type MapInitialView } from '../state/selectors';

export function useMapInitialView(): MapInitialView {
  return useStore(selectMapInitialView);
}
