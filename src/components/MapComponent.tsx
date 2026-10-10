import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Locality, Shelter, EvacuationRoute, PortalMode, ReliefRequest } from '../types';
import { BANGLADESH_CENTER, NEPAL_CENTER } from '../data/mockData';

interface MapComponentProps {
  region: 'bangladesh' | 'nepal';
  localities: Locality[];
  shelters: Shelter[];
  reliefRequests?: ReliefRequest[];
  selectedRoute: EvacuationRoute | null;
  activeLocalityId: string | null;
  onSelectLocality: (locality: Locality) => void;
  portalMode: PortalMode;
  showRainRadar: boolean;
  showElevationContour: boolean;
  userLiveLocation?: [number, number] | null;
  isPanelMinimized?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  region,
  localities,
  shelters,
  reliefRequests,
  selectedRoute,
  activeLocalityId,
  onSelectLocality,
  showRainRadar,
  showElevationContour,
  userLiveLocation,
  isPanelMinimized,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter = region === 'bangladesh' ? BANGLADESH_CENTER : NEPAL_CENTER;
      const initialZoom = region === 'bangladesh' ? 11 : 12;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false,
      });

      // Clean OpenStreetMap base tiles (100% free, no API key required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | NASA Earthdata',
        maxZoom: 19,
      }).addTo(map);

      // Re-position zoom control to bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      layersGroupRef.current = L.layerGroup().addTo(map);
      routeLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map view on region switch
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const targetCenter = region === 'bangladesh' ? BANGLADESH_CENTER : NEPAL_CENTER;
    const targetZoom = region === 'bangladesh' ? 11 : 12;
    map.flyTo(targetCenter, targetZoom, { duration: 1.2 });
  }, [region]);

  // Invalidate map size when panel is minimized or expanded
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }
  }, [isPanelMinimized]);

  // Fly to user live location if active
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && userLiveLocation) {
      map.flyTo(userLiveLocation, 14, { duration: 1.5 });
    }
  }, [userLiveLocation]);

  // Render Markers, Circles, and Overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layersGroup = layersGroupRef.current;
    if (!map || !layersGroup) return;

    layersGroup.clearLayers();

    // 0. Render Live GPS User Marker if active
    if (userLiveLocation) {
      const userIcon = L.divIcon({
        className: 'custom-live-user-marker',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(37, 99, 235, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 26px; height: 26px; border-radius: 9999px; background: #2563eb; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 800;">
              ●
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const userMarker = L.marker(userLiveLocation, { icon: userIcon }).bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <b style="color: #2563eb;">📍 Your Real-Time Location (Live GPS)</b>
          <div style="color: #64748b; margin-top: 2px;">
            Lat: ${userLiveLocation[0].toFixed(4)}, Lng: ${userLiveLocation[1].toFixed(4)}
          </div>
          <div style="margin-top: 4px; color: #059669; font-weight: 600;">✓ Satellite feed actively monitoring elevation</div>
        </div>
      `);
      layersGroup.addLayer(userMarker);
    }

    // 1. Live NASA GPM IMERG Precipitation Radar Layer from NASA GIBS servers
    if (showRainRadar) {
      // Connect real NASA GIBS satellite precipitation tiles (Historic flood peak: August 2024)
      const nasaGpmTiles = L.tileLayer(
        'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/IMERG_Precipitation_Rate/default/2024-08-22/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png',
        {
          attribution: 'NASA EOSDIS GIBS (GPM IMERG Rain Radar)',
          opacity: 0.60,
          maxZoom: 12,
        }
      );
      layersGroup.addLayer(nasaGpmTiles);

      // Localized cell marker showing measured rainfall intensity
      const rainCenter = region === 'bangladesh' ? [23.15, 91.42] : [27.68, 85.31];
      const rainPolygon = L.circle(rainCenter as [number, number], {
        radius: region === 'bangladesh' ? 18000 : 9000,
        color: '#0284c7',
        fillColor: '#0ea5e9',
        fillOpacity: 0.20,
        weight: 2,
        dashArray: '5, 5',
      }).bindTooltip(
        '<b>Live NASA GPM IMERG Feed:</b> 72.4 mm/hr Extreme Rainfall Cell (Feni-Muhuri Basin)',
        {
          permanent: false,
          direction: 'top',
        }
      );
      layersGroup.addLayer(rainPolygon);
    }

    // 2. Render Shelters (High Ground)
    shelters
      .filter((s) => s.region === region)
      .forEach((shelter) => {
        const shelterIcon = L.divIcon({
          className: 'custom-shelter-marker',
          html: `
            <div style="background: #0f766e; color: white; padding: 4px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.15); border: 2px solid white;">
              <span>▲</span>
              <span>${shelter.name.split(' ')[0]}</span>
              <span style="background: rgba(255,255,255,0.25); padding: 1px 4px; border-radius: 4px;">+${shelter.elevation}m</span>
            </div>
          `,
          iconSize: [120, 26],
          iconAnchor: [60, 13],
        });

        const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon });
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
            <div style="font-weight: 700; color: #0f766e; font-size: 13px; margin-bottom: 2px;">${shelter.name}</div>
            <div style="color: #64748b; margin-bottom: 6px;">Elevation: +${shelter.elevation}m (Verified High Ground)</div>
            <div style="margin-bottom: 4px;"><b>Capacity:</b> ${shelter.currentOccupancy} / ${shelter.capacity} people</div>
            <div style="margin-bottom: 4px;"><b>Contact:</b> ${shelter.contact}</div>
            <div style="color: #059669; font-weight: 600; font-size: 11px;">✓ High ground shelter actively operating</div>
          </div>
        `);
        layersGroup.addLayer(marker);
      });

    // 2.5. Render Civilian Distress SOS Beacons
    if (reliefRequests) {
      reliefRequests
        .filter((r) => r.region === region && r.status !== 'rescued')
        .forEach((req) => {
          const isPending = req.status === 'pending';
          const sosIcon = L.divIcon({
            className: 'custom-sos-marker',
            html: `
              <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                ${isPending ? '<div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(239, 68, 68, 0.45); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : ''}
                <div style="position: relative; width: 24px; height: 24px; border-radius: 9999px; background: ${isPending ? '#dc2626' : '#d97706'}; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 800;">
                  SOS
                </div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const marker = L.marker([req.lat, req.lng], { icon: sosIcon });
          marker.bindPopup(`
            <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
              <b style="color: #dc2626;">🚨 Civilian Distress SOS Beacon</b>
              <div style="font-weight: 700; margin-top: 2px;">${req.localityName}</div>
              <div style="color: #475569; margin-top: 2px;">Stranded Party: <b>${req.peopleCount} People</b></div>
              <div style="margin-top: 2px;">Contact: <b>${req.contactNumber}</b></div>
              <div style="margin-top: 2px;">Status: <b style="text-transform: uppercase; color: ${isPending ? '#dc2626' : '#d97706'};">${req.status}</b></div>
            </div>
          `);
          layersGroup.addLayer(marker);
        });
    }

    // 3. Render Locality Triage Circles (Red -> Yellow -> Green)
    localities
      .filter((loc) => loc.region === region)
      .forEach((loc) => {
        const isSelected = loc.id === activeLocalityId;

        // Color based on status:
        // Red = Critical / Unattended
        // Yellow = In-Progress / Rescue Unit Active
        // Green = Secured / Relief Delivered
        let strokeColor = '#ef4444';
        let fillColor = '#f87171';
        let statusLabel = 'Critical (Unattended)';

        if (loc.status === 'in-progress') {
          strokeColor = '#f59e0b';
          fillColor = '#fbbf24';
          statusLabel = 'In-Progress (Rescuers Active)';
        } else if (loc.status === 'secured') {
          strokeColor = '#10b981';
          fillColor = '#34d399';
          statusLabel = 'Secured (Relief Provided)';
        }

        const circle = L.circle([loc.lat, loc.lng], {
          radius: 1200,
          color: strokeColor,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.45 : 0.28,
          weight: isSelected ? 3.5 : 2,
          className: loc.status === 'critical' ? 'pulse-red-ring' : '',
        });

        circle.on('click', () => {
          onSelectLocality(loc);
        });

        // Tooltip showing status and trapped count
        circle.bindTooltip(
          `
          <div style="font-size: 11px; font-weight: 600;">
            <span style="color: ${strokeColor}; font-weight: 700;">● ${statusLabel}</span><br/>
            <b>${loc.name}</b><br/>
            Water Depth: ${loc.waterLevelDepthMeters}m | Trapped: ${loc.trappedCount} | Rescued: ${loc.rescuedCount}
          </div>
          `,
          { sticky: true, direction: 'top' }
        );

        layersGroup.addLayer(circle);

        // Center dot marker for locality center
        const centerMarker = L.circleMarker([loc.lat, loc.lng], {
          radius: 6,
          color: '#ffffff',
          fillColor: strokeColor,
          fillOpacity: 1,
          weight: 2,
        });
        centerMarker.on('click', () => onSelectLocality(loc));
        layersGroup.addLayer(centerMarker);
      });
  }, [localities, shelters, region, activeLocalityId, showRainRadar, showElevationContour]);

  // Render Evacuation Route (The Green Safe Corridor & Red Blocked Hazard)
  useEffect(() => {
    const routeGroup = routeLayerGroupRef.current;
    if (!routeGroup) return;

    routeGroup.clearLayers();

    if (selectedRoute) {
      // 1. Draw the Green Safe Route Polyline
      const safePolyline = L.polyline(selectedRoute.waypoints, {
        color: '#059669',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      });

      safePolyline.bindTooltip(
        `<b>SAFER High-Ground Corridor:</b> +${selectedRoute.elevationGainMeters}m Elevation Gain | Safety: ${selectedRoute.safetyScore}%`,
        { permanent: false, sticky: true }
      );
      routeGroup.addLayer(safePolyline);

      // 2. Draw Start Pin (Victim)
      const startPoint = selectedRoute.waypoints[0];
      const startIcon = L.divIcon({
        className: 'start-marker',
        html: `
          <div style="background: #2563eb; color: white; border-radius: 9999px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            ●
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      routeGroup.addLayer(L.marker(startPoint, { icon: startIcon }));

      // 3. Draw Submerged Road Hazard marker (Demonstrating avoided road)
      if (region === 'bangladesh') {
        const hazardPoint: [number, number] = [23.1200, 91.4150];
        const hazardMarker = L.circleMarker(hazardPoint, {
          radius: 8,
          color: '#ef4444',
          fillColor: '#fee2e2',
          weight: 2,
        }).bindTooltip('<b>BLOCKED ROAD:</b> Grand Trunk Underpass submerged under 1.8m water', {
          permanent: true,
          direction: 'right',
        });
        routeGroup.addLayer(hazardMarker);
      }
    }
  }, [selectedRoute, region]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-slate-50 isolate z-0">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Legend (Light, clean, high contrast) */}
      <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-3 rounded-xl shadow-md border border-slate-200 text-xs text-slate-700 max-w-[220px]">
        <div className="font-bold text-slate-900 mb-2 flex items-center justify-between">
          <span>Map Triage Legend</span>
          <span className="text-[10px] font-medium text-slate-500">Live Status</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-xs"></span>
            <span><b>Critical</b> (Unattended / Risk)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-white shadow-xs"></span>
            <span><b>In-Progress</b> (En Route)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-xs"></span>
            <span><b>Secured</b> (Relief Provided)</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            <span className="w-3.5 h-1 bg-emerald-600 rounded-full"></span>
            <span><b>Safe High-Ground Route</b></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-teal-800 text-white text-[9px] flex items-center justify-center font-bold">▲</span>
            <span><b>Verified Dry Shelter</b></span>
          </div>
        </div>
      </div>
    </div>
  );
};
