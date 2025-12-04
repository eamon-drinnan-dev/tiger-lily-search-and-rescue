/**
 * TigerLilyMap
 * @description Cesium 3D globe component for SAR operations visualization
 * @example
 * <TigerLilyMap />
 */

import React, { useEffect, useRef } from 'react';
import { Viewer, Cartesian3, Math as CesiumMath } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './TigerLilyMap.less';

export interface TigerLilyMapProps {
  className?: string;
}

export const TigerLilyMap: React.FC<TigerLilyMapProps> = ({ className }) => {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (!cesiumContainerRef.current || viewerRef.current) {
      return;
    }

    // Initialize Cesium Viewer
    const viewer = new Viewer(cesiumContainerRef.current, {
      // Disable unnecessary features for better performance
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      homeButton: true,
      sceneModePicker: true,
      baseLayerPicker: false,
      navigationHelpButton: false,
      geocoder: false,
      infoBox: false,
      selectionIndicator: false,
    });

    viewerRef.current = viewer;

    // Position camera at Guelph, Ontario
    // Coordinates: 43.5448° N, 80.2482° W
    // Height: 15000 meters for good overview
    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(
        -80.2482, // Longitude (negative for West)
        43.5448,  // Latitude
        15000     // Height in meters
      ),
      orientation: {
        heading: CesiumMath.toRadians(0),   // North
        pitch: CesiumMath.toRadians(-90),   // Looking straight down
        roll: 0,
      },
    });

    // Cleanup on unmount
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`tiger-lily-map ${className || ''}`}>
      <div ref={cesiumContainerRef} className="tiger-lily-map__cesium-container" />
    </div>
  );
};
