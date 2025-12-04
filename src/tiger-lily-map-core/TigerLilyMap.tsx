/**
 * TigerLilyMap
 * @description Cesium 3D globe component for SAR operations visualization
 * @example
 * <TigerLilyMap />
 */

import React, { useEffect, useRef } from 'react';
import { Viewer } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './TigerLilyMap.less';
import { useMapInitialView } from '../hooks/useMapInitialView';
import { positionCamera } from './mapCameraPositioning';

export interface TigerLilyMapProps {
  className?: string;
}

export const TigerLilyMap: React.FC<TigerLilyMapProps> = ({ className }) => {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const mapInitialView = useMapInitialView();

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

    // Disable camera inertia to prevent drift
    viewer.scene.screenSpaceCameraController.enableTilt = true;
    viewer.scene.screenSpaceCameraController.inertiaSpin = 0;
    viewer.scene.screenSpaceCameraController.inertiaTranslate = 0;
    viewer.scene.screenSpaceCameraController.inertiaZoom = 0;

    // Position camera based on state priority chain
    positionCamera(viewer, mapInitialView);

    // Cleanup on unmount
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [mapInitialView]);

  return (
    <div className={`tiger-lily-map ${className || ''}`}>
      <div ref={cesiumContainerRef} className="tiger-lily-map__cesium-container" />
    </div>
  );
};
