export type PortalMode = 'victim' | 'rescuer';

export type LocalityStatus = 'critical' | 'in-progress' | 'secured';

export interface Locality {
  id: string;
  name: string;
  region: 'bangladesh' | 'nepal';
  lat: number;
  lng: number;
  elevation: number; // in meters
  riskLevel: 'critical' | 'high' | 'moderate';
  status: LocalityStatus;
  trappedCount: number;
  rescuedCount: number;
  reliefPacksDelivered: number;
  waterKitsDelivered: number;
  medicalAssistanceGiven: boolean;
  waterLevelDepthMeters: number;
  lastUpdated: string;
  assignedTeam?: string;
  notes?: string;
}

export interface Shelter {
  id: string;
  name: string;
  region: 'bangladesh' | 'nepal';
  lat: number;
  lng: number;
  elevation: number; // in meters
  capacity: number;
  currentOccupancy: number;
  status: 'open' | 'near-capacity' | 'full';
  contact: string;
  facilities: string[];
}

export interface EvacuationRoute {
  shelterId: string;
  shelterName: string;
  distanceKm: number;
  elevationGainMeters: number;
  estimatedTimeMin: number;
  safetyScore: number; // out of 100
  waypoints: [number, number][];
  avoidedHazard: string;
  instructions: {
    step: number;
    text: string;
    elevationNotice?: string;
    isSafe: boolean;
  }[];
}

export interface ReliefRequest {
  id: string;
  region: 'bangladesh' | 'nepal';
  localityName: string;
  lat: number;
  lng: number;
  contactNumber: string;
  peopleCount: number;
  hasInjured: boolean;
  hasInfantsOrElderly: boolean;
  needsBoat: boolean;
  needsFoodAndWater: boolean;
  status: 'pending' | 'dispatched' | 'rescued';
  timestamp: string;
  assignedTeam?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  localityId: string;
  localityName: string;
  teamName: string;
  actionTaken: string;
  peopleRescued: number;
  foodDelivered: number;
  waterDelivered: number;
  statusChangedTo: LocalityStatus;
}
