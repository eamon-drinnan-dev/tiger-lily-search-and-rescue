/**
 * Map Camera Positioning Utilities
 * @description Handles Cesium camera positioning based on map initial view state
 */

import { Viewer, Cartesian3, Math as CesiumMath, BoundingSphere } from 'cesium';
import type { MapInitialView } from '../state/selectors';
import { MapInitialViewTypes } from '../state/selectors';
import { EntityKinds } from '../tiger-lily-types/index';

// Default fallback position: Guelph, Ontario
const DEFAULT_POSITION = {
  lon: -80.2482,
  lat: 43.5448,
  height: 15000,
} as const;

/**
 * Positions the Cesium camera based on the MapInitialView priority chain
 * @param viewer - Cesium Viewer instance
 * @param mapInitialView - The map initial view state from the selector
 */
export function positionCamera(viewer: Viewer, mapInitialView: MapInitialView): void {
  switch (mapInitialView.type) {
    case MapInitialViewTypes.MISSION_AOI: {
      // Priority 1: Fly to mission AOI bounding sphere
      const { center, radiusMeters } = mapInitialView.aoi;
      const centerCartesian = Cartesian3.fromDegrees(center.lon, center.lat);
      const boundingSphere = new BoundingSphere(centerCartesian, radiusMeters);
      viewer.camera.flyToBoundingSphere(boundingSphere, {
        duration: 0, // Instant for initial load
      });
      break;
    }

    case MapInitialViewTypes.FIT_ENTITIES: {
      // Priority 2: Calculate bounds from all entities and fit camera
      // Extract positions from different entity types
      const positions: Cartesian3[] = [];

      mapInitialView.entities.forEach((entity) => {
        if (entity.kind === EntityKinds.DRONE || entity.kind === EntityKinds.INCIDENT) {
          // Drones and Incidents have position
          positions.push(
            Cartesian3.fromDegrees(
              entity.position.lon,
              entity.position.lat,
              entity.position.altMeters || 0
            )
          );
        } else if (entity.kind === EntityKinds.K9 || entity.kind === EntityKinds.RESPONDER) {
          // K9Units and Responders have optional lastKnownPosition
          if (entity.lastKnownPosition) {
            positions.push(
              Cartesian3.fromDegrees(
                entity.lastKnownPosition.lon,
                entity.lastKnownPosition.lat,
                entity.lastKnownPosition.altMeters || 0
              )
            );
          }
        }
        // Zones are excluded - they have polygon geometry, not point position
      });

      if (positions.length > 0) {
        const boundingSphere = BoundingSphere.fromPoints(positions);
        // Expand radius for padding
        boundingSphere.radius = boundingSphere.radius * 1.5;
        viewer.camera.flyToBoundingSphere(boundingSphere, {
          duration: 0,
        });
      }
      break;
    }

    case MapInitialViewTypes.SAVED_DEFAULT: {
      // Priority 3: Use saved default view
      const { center, height, heading, pitch, roll } = mapInitialView.view;
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(center.lon, center.lat, height),
        orientation: {
          heading: CesiumMath.toRadians(heading || 0),
          pitch: CesiumMath.toRadians(pitch || -90),
          roll: roll || 0,
        },
      });
      break;
    }

    case MapInitialViewTypes.PROMPT_USER:
    default: {
      // Priority 4: No data available, use default Guelph position
      // TODO: Add UI prompt for user to select initial view
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(
          DEFAULT_POSITION.lon,
          DEFAULT_POSITION.lat,
          DEFAULT_POSITION.height
        ),
        orientation: {
          heading: CesiumMath.toRadians(0), // North
          pitch: CesiumMath.toRadians(-90), // Looking straight down
          roll: 0,
        },
      });
      break;
    }
  }
}
