/**
 * Mock Database
 *
 * In-memory mock data for Tiger Lily SAR application.
 * Scenario: Missing hiker in Mount Tamalpais State Park, California
 * Coordinates centered around: 37.9235° N, 122.5965° W
 */

import { generateId } from '../lib/id';
import type {
  Drone,
  K9Unit,
  Responder,
  Incident,
  Zone,
  ID,
} from '../tiger-lily-types';
import {
  EntityKinds,
  DroneStatuses,
  K9Statuses,
  K9Capabilities,
  ResponderRoles,
  IncidentTypes,
  Severities,
  ZoneTypes,
  ScentTypes,
  ScentConfidences,
} from '../tiger-lily-types';

//
// Helper: Generate timestamp
//

const now = new Date();
const hoursAgo = (hours: number) =>
  new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();

//
// Mock Data: Drones
//

const drone1: Drone = {
  id: generateId(),
  kind: EntityKinds.DRONE,
  label: 'Moose-1',
  callsign: 'MOOSE1',
  model: 'DJI Matrice 300 RTK',
  status: DroneStatuses.IN_FLIGHT,
  position: { lat: 37.9245, lon: -122.5975, altMeters: 120 },
  headingDeg: 245,
  groundSpeedMps: 8.5,
  batteryPct: 72,
  linkQualityPct: 95,
  notes: 'Searching northern ridge area',
  createdAt: hoursAgo(3),
  updatedAt: hoursAgo(0.1),
};

const drone2: Drone = {
  id: generateId(),
  kind: EntityKinds.DRONE,
  label: 'Lynx-2',
  callsign: 'LYNX2',
  model: 'DJI Mavic 3 Enterprise',
  status: DroneStatuses.HOVER_HOLD,
  position: { lat: 37.9220, lon: -122.5950, altMeters: 85 },
  headingDeg: 90,
  groundSpeedMps: 0,
  batteryPct: 45,
  linkQualityPct: 88,
  notes: 'Holding position near suspicious area',
  createdAt: hoursAgo(2.5),
  updatedAt: hoursAgo(0.05),
};

const drone3: Drone = {
  id: generateId(),
  kind: EntityKinds.DRONE,
  label: 'Caribou-3',
  callsign: 'CARIBOU3',
  model: 'Autel EVO II Pro',
  status: DroneStatuses.RETURNING,
  position: { lat: 37.9200, lon: -122.5920, altMeters: 95 },
  headingDeg: 180,
  groundSpeedMps: 12.0,
  batteryPct: 18,
  linkQualityPct: 92,
  notes: 'Low battery, returning to base',
  createdAt: hoursAgo(2),
  updatedAt: hoursAgo(0.02),
};

const drone4: Drone = {
  id: generateId(),
  kind: EntityKinds.DRONE,
  label: 'Spruce-4',
  callsign: 'SPRUCE4',
  model: 'DJI Matrice 30T',
  status: DroneStatuses.CHARGING,
  position: { lat: 37.9180, lon: -122.5900, altMeters: 0 },
  headingDeg: 0,
  groundSpeedMps: 0,
  batteryPct: 63,
  linkQualityPct: 100,
  notes: 'Charging at staging area',
  createdAt: hoursAgo(4),
  updatedAt: hoursAgo(0.5),
};

const drone5: Drone = {
  id: generateId(),
  kind: EntityKinds.DRONE,
  label: 'Cedar-5',
  callsign: 'CEDAR5',
  model: 'DJI Mavic 3 Enterprise',
  status: DroneStatuses.IDLE,
  position: { lat: 37.9180, lon: -122.5900, altMeters: 0 },
  headingDeg: 0,
  groundSpeedMps: 0,
  batteryPct: 100,
  linkQualityPct: 100,
  notes: 'Ready for deployment',
  createdAt: hoursAgo(1),
  updatedAt: hoursAgo(0.3),
};

const drone6: Drone = {
  id: generateId(),
  kind: EntityKinds.DRONE,
  label: 'Jasper-6',
  callsign: 'JASPER6',
  model: 'DJI Mavic 3 Thermal',
  status: DroneStatuses.LOST_COMM,
  position: { lat: 37.9260, lon: -122.6010, altMeters: 110 },
  headingDeg: 315,
  groundSpeedMps: 0,
  batteryPct: 34,
  linkQualityPct: 0,
  notes: 'Lost communication 8 minutes ago',
  createdAt: hoursAgo(3),
  updatedAt: hoursAgo(0.13),
};

export const mockDrones = new Map<ID, Drone>([
  [drone1.id, drone1],
  [drone2.id, drone2],
  [drone3.id, drone3],
  [drone4.id, drone4],
  [drone5.id, drone5],
  [drone6.id, drone6],
]);

//
// Mock Data: K9 Units
//

const k9Unit1: K9Unit = {
  id: generateId(),
  kind: EntityKinds.K9,
  label: 'K9 Team - Max',
  dogName: 'Max',
  handlerName: 'Sarah Chen',
  status: K9Statuses.SEARCHING,
  lastKnownPosition: { lat: 37.9235, lon: -122.5965, altMeters: 620 },
  capabilities: [K9Capabilities.AIRSCENT, K9Capabilities.TRAILING],
  notes: 'German Shepherd, 6 years old, certified SAR',
  createdAt: hoursAgo(4),
  updatedAt: hoursAgo(0.15),
};

const k9Unit2: K9Unit = {
  id: generateId(),
  kind: EntityKinds.K9,
  label: 'K9 Team - Luna',
  dogName: 'Luna',
  handlerName: 'Marcus Rodriguez',
  status: K9Statuses.SEARCHING,
  lastKnownPosition: { lat: 37.9250, lon: -122.5985, altMeters: 580 },
  capabilities: [K9Capabilities.AIRSCENT],
  notes: 'Border Collie, 4 years old, high energy',
  createdAt: hoursAgo(3.5),
  updatedAt: hoursAgo(0.12),
};

const k9Unit3: K9Unit = {
  id: generateId(),
  kind: EntityKinds.K9,
  label: 'K9 Team - Duke',
  dogName: 'Duke',
  handlerName: 'Emma Thompson',
  status: K9Statuses.RESTING,
  lastKnownPosition: { lat: 37.9180, lon: -122.5900, altMeters: 480 },
  capabilities: [K9Capabilities.TRAILING, K9Capabilities.CADAVER],
  notes: 'Bloodhound, 7 years old, veteran SAR dog',
  createdAt: hoursAgo(5),
  updatedAt: hoursAgo(0.5),
};

const k9Unit4: K9Unit = {
  id: generateId(),
  kind: EntityKinds.K9,
  label: 'K9 Team - Bella',
  dogName: 'Bella',
  handlerName: 'James Park',
  status: K9Statuses.EN_ROUTE,
  lastKnownPosition: { lat: 37.9190, lon: -122.5910, altMeters: 500 },
  capabilities: [K9Capabilities.AIRSCENT],
  notes: 'Golden Retriever, 5 years old',
  createdAt: hoursAgo(2),
  updatedAt: hoursAgo(0.25),
};

export const mockK9Units = new Map<ID, K9Unit>([
  [k9Unit1.id, k9Unit1],
  [k9Unit2.id, k9Unit2],
  [k9Unit3.id, k9Unit3],
  [k9Unit4.id, k9Unit4],
]);

//
// Mock Data: Responders
//

const responder1: Responder = {
  id: generateId(),
  kind: EntityKinds.RESPONDER,
  label: 'Command - IC Davis',
  role: ResponderRoles.COMMAND,
  teamName: 'Marin County SAR',
  lastKnownPosition: { lat: 37.9180, lon: -122.5900, altMeters: 480 },
  isInField: true,
  notes: 'Incident Commander Robert Davis',
  createdAt: hoursAgo(5),
  updatedAt: hoursAgo(0.2),
};

const responder2: Responder = {
  id: generateId(),
  kind: EntityKinds.RESPONDER,
  label: 'Ground Team Alpha',
  role: ResponderRoles.GROUND_TEAM,
  teamName: 'Team Alpha',
  lastKnownPosition: { lat: 37.9228, lon: -122.5958, altMeters: 590 },
  isInField: true,
  notes: '4 members, searching eastern slopes',
  createdAt: hoursAgo(4),
  updatedAt: hoursAgo(0.18),
};

const responder3: Responder = {
  id: generateId(),
  kind: EntityKinds.RESPONDER,
  label: 'Ground Team Bravo',
  role: ResponderRoles.GROUND_TEAM,
  teamName: 'Team Bravo',
  lastKnownPosition: { lat: 37.9252, lon: -122.5992, altMeters: 610 },
  isInField: true,
  notes: '5 members, searching northern ridge',
  createdAt: hoursAgo(3.5),
  updatedAt: hoursAgo(0.1),
};

const responder4: Responder = {
  id: generateId(),
  kind: EntityKinds.RESPONDER,
  label: 'Medical Team',
  role: ResponderRoles.MEDIC,
  teamName: 'Medical Response',
  lastKnownPosition: { lat: 37.9180, lon: -122.5900, altMeters: 480 },
  isInField: true,
  notes: '2 paramedics on standby',
  createdAt: hoursAgo(4),
  updatedAt: hoursAgo(0.4),
};

const responder5: Responder = {
  id: generateId(),
  kind: EntityKinds.RESPONDER,
  label: 'Logistics Team',
  role: ResponderRoles.LOGISTICS,
  teamName: 'Supply & Coordination',
  lastKnownPosition: { lat: 37.9180, lon: -122.5900, altMeters: 480 },
  isInField: false,
  notes: 'Managing equipment and supplies',
  createdAt: hoursAgo(5),
  updatedAt: hoursAgo(1),
};

export const mockResponders = new Map<ID, Responder>([
  [responder1.id, responder1],
  [responder2.id, responder2],
  [responder3.id, responder3],
  [responder4.id, responder4],
  [responder5.id, responder5],
]);

//
// Mock Data: Incidents
//

const incident1: Incident = {
  id: generateId(),
  kind: EntityKinds.INCIDENT,
  label: 'Last Known Position',
  incidentType: IncidentTypes.LAST_KNOWN_POSITION,
  severity: Severities.CRITICAL,
  position: { lat: 37.9242, lon: -122.5978, altMeters: 600 },
  notes: 'Hiker last seen at 2:30 PM, reported by trail companion',
  createdAt: hoursAgo(6),
  updatedAt: hoursAgo(6),
};

const incident2: Incident = {
  id: generateId(),
  kind: EntityKinds.INCIDENT,
  label: 'Backpack Found',
  incidentType: IncidentTypes.EVIDENCE,
  severity: Severities.MAJOR,
  position: { lat: 37.9238, lon: -122.5982, altMeters: 595 },
  relatedEntityIds: [k9Unit1.id],
  notes: 'Blue backpack, matches description from companion',
  createdAt: hoursAgo(2),
  updatedAt: hoursAgo(2),
};

const incident3: Incident = {
  id: generateId(),
  kind: EntityKinds.INCIDENT,
  label: 'Footprints',
  incidentType: IncidentTypes.CLUE,
  severity: Severities.MAJOR,
  position: { lat: 37.9248, lon: -122.5988, altMeters: 605 },
  relatedEntityIds: [responder2.id],
  notes: 'Fresh footprints heading northeast, size matches',
  createdAt: hoursAgo(1.5),
  updatedAt: hoursAgo(1.5),
};

const incident4: Incident = {
  id: generateId(),
  kind: EntityKinds.INCIDENT,
  label: 'Possible Sighting',
  incidentType: IncidentTypes.SIGHTING,
  severity: Severities.MAJOR,
  position: { lat: 37.9255, lon: -122.5995, altMeters: 615 },
  relatedEntityIds: [drone2.id],
  notes: 'Thermal signature detected by drone, awaiting confirmation',
  createdAt: hoursAgo(0.5),
  updatedAt: hoursAgo(0.5),
};

const incident5: Incident = {
  id: generateId(),
  kind: EntityKinds.INCIDENT,
  label: 'Trail Marker Note',
  incidentType: IncidentTypes.NOTE,
  severity: Severities.INFO,
  position: { lat: 37.9230, lon: -122.5970, altMeters: 585 },
  notes: 'Trail conditions noted: muddy, slippery rocks',
  createdAt: hoursAgo(3),
  updatedAt: hoursAgo(3),
};

export const mockIncidents = new Map<ID, Incident>([
  [incident1.id, incident1],
  [incident2.id, incident2],
  [incident3.id, incident3],
  [incident4.id, incident4],
  [incident5.id, incident5],
]);

//
// Mock Data: Zones
//

const zone1: Zone = {
  id: generateId(),
  kind: EntityKinds.ZONE,
  label: 'Primary Search Area',
  zoneType: ZoneTypes.SEARCH_AREA,
  geometry: {
    vertices: [
      { lat: 37.9230, lon: -122.5960, altMeters: 580 },
      { lat: 37.9260, lon: -122.5960, altMeters: 580 },
      { lat: 37.9260, lon: -122.6000, altMeters: 620 },
      { lat: 37.9230, lon: -122.6000, altMeters: 620 },
    ],
  },
  altitudeFloorMeters: 550,
  altitudeCeilingMeters: 650,
  active: true,
  notes: '1 km² priority search grid',
  createdAt: hoursAgo(5),
  updatedAt: hoursAgo(4),
};

const zone2: Zone = {
  id: generateId(),
  kind: EntityKinds.ZONE,
  label: 'K9 Alert Zone - Max',
  zoneType: ZoneTypes.SCENT_ZONE,
  geometry: {
    vertices: [
      { lat: 37.9240, lon: -122.5980, altMeters: 595 },
      { lat: 37.9245, lon: -122.5980, altMeters: 595 },
      { lat: 37.9245, lon: -122.5990, altMeters: 605 },
      { lat: 37.9240, lon: -122.5990, altMeters: 605 },
    ],
  },
  active: true,
  scentMeta: {
    k9Id: k9Unit1.id,
    scentType: ScentTypes.AIRSCENT,
    confidence: ScentConfidences.HIGH,
    firstDetectedAt: hoursAgo(1.8),
  },
  notes: 'Strong scent detection by Max',
  createdAt: hoursAgo(1.8),
  updatedAt: hoursAgo(1.8),
};

const zone3: Zone = {
  id: generateId(),
  kind: EntityKinds.ZONE,
  label: 'Steep Cliff Hazard',
  zoneType: ZoneTypes.HAZARD,
  geometry: {
    vertices: [
      { lat: 37.9265, lon: -122.6005, altMeters: 625 },
      { lat: 37.9270, lon: -122.6005, altMeters: 625 },
      { lat: 37.9270, lon: -122.6015, altMeters: 630 },
      { lat: 37.9265, lon: -122.6015, altMeters: 630 },
    ],
  },
  active: true,
  notes: 'Unstable terrain, extreme caution advised',
  createdAt: hoursAgo(5),
  updatedAt: hoursAgo(5),
};

const zone4: Zone = {
  id: generateId(),
  kind: EntityKinds.ZONE,
  label: 'Staging Area',
  zoneType: ZoneTypes.STAGING,
  geometry: {
    vertices: [
      { lat: 37.9175, lon: -122.5895, altMeters: 475 },
      { lat: 37.9185, lon: -122.5895, altMeters: 475 },
      { lat: 37.9185, lon: -122.5905, altMeters: 485 },
      { lat: 37.9175, lon: -122.5905, altMeters: 485 },
    ],
  },
  active: true,
  notes: 'Base camp and equipment staging',
  createdAt: hoursAgo(6),
  updatedAt: hoursAgo(5),
};

const zone5: Zone = {
  id: generateId(),
  kind: EntityKinds.ZONE,
  label: 'Restricted Airspace',
  zoneType: ZoneTypes.NO_FLY,
  geometry: {
    vertices: [
      { lat: 37.9200, lon: -122.5920, altMeters: 500 },
      { lat: 37.9210, lon: -122.5920, altMeters: 500 },
      { lat: 37.9210, lon: -122.5940, altMeters: 520 },
      { lat: 37.9200, lon: -122.5940, altMeters: 520 },
    ],
  },
  altitudeFloorMeters: 0,
  altitudeCeilingMeters: 150,
  active: true,
  notes: 'Near residential area, FAA restricted',
  createdAt: hoursAgo(6),
  updatedAt: hoursAgo(6),
};

const zone6: Zone = {
  id: generateId(),
  kind: EntityKinds.ZONE,
  label: 'K9 Alert Zone - Luna',
  zoneType: ZoneTypes.SCENT_ZONE,
  geometry: {
    vertices: [
      { lat: 37.9248, lon: -122.5983, altMeters: 575 },
      { lat: 37.9252, lon: -122.5983, altMeters: 575 },
      { lat: 37.9252, lon: -122.5987, altMeters: 585 },
      { lat: 37.9248, lon: -122.5987, altMeters: 585 },
    ],
  },
  active: true,
  scentMeta: {
    k9Id: k9Unit2.id,
    scentType: ScentTypes.AIRSCENT,
    confidence: ScentConfidences.MEDIUM,
    firstDetectedAt: hoursAgo(0.8),
  },
  notes: 'Moderate scent detection by Luna',
  createdAt: hoursAgo(0.8),
  updatedAt: hoursAgo(0.8),
};

export const mockZones = new Map<ID, Zone>([
  [zone1.id, zone1],
  [zone2.id, zone2],
  [zone3.id, zone3],
  [zone4.id, zone4],
  [zone5.id, zone5],
  [zone6.id, zone6],
]);

//
// Database Export
//

export const mockDatabase = {
  drones: mockDrones,
  k9Units: mockK9Units,
  responders: mockResponders,
  incidents: mockIncidents,
  zones: mockZones,
};
