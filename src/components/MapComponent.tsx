import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Locality, Shelter, EvacuationRoute, PortalMode, ReliefRequest } from '../types';
import { BANGLADESH_CENTER, NEPAL_CENTER } from '../data/mockData';
import { Layers, Map as MapIcon, ChevronDown, ChevronUp, Info } from 'lucide-react';

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
  isDarkMode?: boolean;
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
  isDarkMode = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  // Google Map layer selection: 'streets' vs 'satellite' (Hybrid)
  const [mapLayerType, setMapLayerType] = useState<'streets' | 'satellite'>('streets');
  // Collapsible legend state (avoids blocking markers on smaller screens)
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(true);

  // Helper to get Google Map Tile Config
  const getGoogleTileConfig = (isDark: boolean, layer: 'streets' | 'satellite') => {
    if (layer === 'satellite') {
      return {
        url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        className: 'google-satellite-tiles',
        attribution: '&copy; Google Maps (Satellite Hybrid) | NASA Earthdata',
      };
    }
    return {
      url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      className: isDark ? 'google-dark-tiles' : 'google-light-tiles',
      attribution: '&copy; Google Maps | NASA Earthdata',
    };
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter = region === 'bangladesh' ? BANGLADESH_CENTER : NEPAL_CENTER;
      const initialZoom = 12;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false,
      });

      // Initial Google Maps base tile layer
      const config = getGoogleTileConfig(isDarkMode, mapLayerType);
      const tileLayer = L.tileLayer(config.url, {
        subdomains: ['0', '1', '2', '3'],
        attribution: config.attribution,
        maxZoom: 20,
        className: config.className,
      }).addTo(map);

      baseTileLayerRef.current = tileLayer;

      // Position zoom control at bottom right with generous touch margin
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      layersGroupRef.current = L.layerGroup().addTo(map);
      routeLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Responsive ResizeObserver: eliminates gray boxes when columns toggle or window resizes
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(mapContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Update base tile layer on dark mode or layer type change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    const config = getGoogleTileConfig(isDarkMode, mapLayerType);
    baseTileLayerRef.current = L.tileLayer(config.url, {
      subdomains: ['0', '1', '2', '3'],
      attribution: config.attribution,
      maxZoom: 20,
      className: config.className,
    }).addTo(map);

    baseTileLayerRef.current.bringToBack();
  }, [isDarkMode, mapLayerType]);

  // Update map view on region switch
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const targetCenter = region === 'bangladesh' ? BANGLADESH_CENTER : NEPAL_CENTER;
    map.flyTo(targetCenter, 12, { duration: 1.2 });
  }, [region]);

  // Invalidate map size when layout minimization toggles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }
  }, [isPanelMinimized]);

  // Smoothly fly to active locality when selected from Sector Control
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeLocalityId) return;

    const target = localities.find((l) => l.id === activeLocalityId);
    if (target) {
      map.flyTo([target.lat, target.lng], 13, { duration: 1.0 });
    }
  }, [activeLocalityId, localities]);

  // Fly to user live location if active
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && userLiveLocation) {
      map.flyTo(userLiveLocation, 13, { duration: 1.5 });
    }
  }, [userLiveLocation]);

  // Keep onSelectLocality callback ref stable to prevent unnecessary layer re-draws
  const onSelectLocalityRef = useRef(onSelectLocality);
  useEffect(() => {
    onSelectLocalityRef.current = onSelectLocality;
  }, [onSelectLocality]);

  // Render Markers, Circles, and Overlays with strict Z-Index and Anchoring
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layersGroup = layersGroupRef.current;
    if (!map || !layersGroup) return;

    layersGroup.clearLayers();

    // 0. Render Live GPS User Marker (Highest z-index 1500)
    if (userLiveLocation) {
      const userIcon = L.divIcon({
        className: 'custom-live-user-marker',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; pointer-events: auto;">
            <div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(37, 99, 235, 0.45); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>
            <div style="position: relative; width: 26px; height: 26px; border-radius: 9999px; background: #2563eb; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 800; pointer-events: auto;">
              ●
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const userMarker = L.marker(userLiveLocation, { icon: userIcon, zIndexOffset: 1500 }).bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
          <b style="color: #2563eb; font-size: 13px;">📍 Your Real-Time Location (Live GPS)</b>
          <div style="color: #475569; margin-top: 3px;">
            Lat: <b>${userLiveLocation[0].toFixed(4)}</b>, Lng: <b>${userLiveLocation[1].toFixed(4)}</b>
          </div>
          <div style="margin-top: 4px; color: #059669; font-weight: 700;">✓ Satellite actively tracking elevation & flood level</div>
        </div>
      `);
      layersGroup.addLayer(userMarker);
    }

    // 1. Live NASA GPM IMERG Precipitation Radar Layer
    if (showRainRadar) {
      const nasaGpmTiles = L.tileLayer(
        'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/IMERG_Precipitation_Rate/default/2024-08-22/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png',
        {
          attribution: 'NASA EOSDIS GIBS (GPM IMERG Rain Radar)',
          opacity: 0.55,
          maxZoom: 12,
        }
      );
      layersGroup.addLayer(nasaGpmTiles);

      const rainCenter = region === 'bangladesh' ? [23.15, 91.42] : [27.68, 85.31];
      const rainPolygon = L.circle(rainCenter as [number, number], {
        radius: region === 'bangladesh' ? 18000 : 9000,
        color: '#0284c7',
        fillColor: '#0ea5e9',
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '5, 5',
        interactive: false, // Purely visual weather overlay; never intercepts marker clicks or hovers
      });
      layersGroup.addLayer(rainPolygon);
    }

    // 2. Render Shelters (High Ground) with bottom-point anchor (z-index 900)
    shelters
      .filter((s) => s.region === region)
      .forEach((shelter) => {
        const shelterNameShort = shelter.name.split(' ')[0];
        const shelterIcon = L.divIcon({
          className: 'custom-shelter-marker',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35)); pointer-events: auto; user-select: none;">
              <div style="background: #0f766e; color: white; padding: 4px 8px; border-radius: 9999px; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 4px; border: 2px solid white; white-space: nowrap;">
                <span style="font-size: 10px;">▲</span>
                <span>${shelterNameShort}</span>
                <span style="background: rgba(255,255,255,0.25); padding: 1px 4px; border-radius: 4px; font-weight: 900;">+${shelter.elevation}m</span>
              </div>
              <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid #0f766e; margin-top: -1px;"></div>
            </div>
          `,
          iconSize: [120, 32],
          iconAnchor: [60, 32], // Point touches ground at exact coordinates
        });

        const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon, zIndexOffset: 900 });
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
            <div style="font-weight: 800; color: #0f766e; font-size: 13px; margin-bottom: 3px;">${shelter.name}</div>
            <div style="color: #475569; margin-bottom: 5px;">Safe Elevation: <b style="color: #0f766e;">+${shelter.elevation}m</b> (Verified High Ground)</div>
            <div style="margin-bottom: 3px;"><b>Capacity:</b> ${shelter.currentOccupancy} / ${shelter.capacity} people</div>
            <div style="margin-bottom: 3px;"><b>Emergency Contact:</b> ${shelter.contact}</div>
            <div style="color: #059669; font-weight: 700; font-size: 11px; margin-top: 4px;">✓ Safe multi-story concrete structure operating</div>
          </div>
        `);
        layersGroup.addLayer(marker);
      });

    // 2.5. Render Civilian Distress SOS Beacons (z-index 1200)
    if (reliefRequests) {
      reliefRequests
        .filter((r) => r.region === region && r.status !== 'rescued')
        .forEach((req) => {
          const isPending = req.status === 'pending';
          const sosIcon = L.divIcon({
            className: 'custom-sos-marker',
            html: `
              <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; pointer-events: auto;">
                ${isPending ? '<div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(239, 68, 68, 0.5); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>' : ''}
                <div style="position: relative; width: 26px; height: 26px; border-radius: 9999px; background: ${isPending ? '#dc2626' : '#d97706'}; border: 2.5px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 900; pointer-events: auto;">
                  SOS
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = L.marker([req.lat, req.lng], { icon: sosIcon, zIndexOffset: 1200 });
          marker.bindPopup(`
            <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
              <b style="color: #ef4444; font-size: 13px;">🚨 Civilian Distress SOS Beacon</b>
              <div style="font-weight: 800; margin-top: 3px;">${req.localityName}</div>
              <div style="margin-top: 2px;">Stranded Party: <b>${req.peopleCount} People</b></div>
              <div style="margin-top: 2px;">Contact: <b>${req.contactNumber}</b></div>
              <div style="margin-top: 2px;">Needs: <b>${[req.needsBoat ? 'Boat' : '', req.needsFoodAndWater ? 'Food/Water' : '', req.hasInjured ? 'Medical' : ''].filter(Boolean).join(', ')}</b></div>
              <div style="margin-top: 4px;">Status: <b style="text-transform: uppercase; color: ${isPending ? '#ef4444' : '#f59e0b'}; font-weight: 800;">${req.status}</b></div>
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
          onSelectLocalityRef.current(loc);
        });

        circle.bindTooltip(
          `
          <div style="font-size: 11px; font-weight: 600;">
            <span style="color: ${strokeColor}; font-weight: 800;">● ${statusLabel}</span><br/>
            <b>${loc.name}</b><br/>
            Water Depth: ${loc.waterLevelDepthMeters}m | Trapped: ${loc.trappedCount} | Rescued: ${loc.rescuedCount}
          </div>
          `,
          { permanent: false, direction: 'top', offset: [0, -10] }
        );

        layersGroup.addLayer(circle);

        const centerMarker = L.circleMarker([loc.lat, loc.lng], {
          radius: 6,
          color: '#ffffff',
          fillColor: strokeColor,
          fillOpacity: 1,
          weight: 2,
        });
        centerMarker.on('click', () => onSelectLocalityRef.current(loc));
        layersGroup.addLayer(centerMarker);
      });
  }, [localities, shelters, reliefRequests, region, activeLocalityId, showRainRadar, showElevationContour, userLiveLocation]);

  // Render Evacuation Route & Auto-fit bounds
  useEffect(() => {
    const routeGroup = routeLayerGroupRef.current;
    if (!routeGroup) return;

    routeGroup.clearLayers();

    if (selectedRoute) {
      // 1. Draw the Green Safe Route Polyline
      const safePolyline = L.polyline(selectedRoute.waypoints, {
        color: '#10b981',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      });

      safePolyline.bindTooltip(
        `<b>SAFER High-Ground Corridor:</b> +${selectedRoute.elevationGainMeters}m Elevation Gain | Safety: ${selectedRoute.safetyScore}%`,
        { permanent: false, sticky: true }
      );
      routeGroup.addLayer(safePolyline);

      // Frame route smoothly in viewport
      if (mapInstanceRef.current) {
        mapInstanceRef.current.fitBounds(safePolyline.getBounds(), {
          padding: [60, 60],
          maxZoom: 14,
        });
      }

      // 2. Draw Start Pin (Victim)
      const startPoint = selectedRoute.waypoints[0];
      const startIcon = L.divIcon({
        className: 'start-marker',
        html: `
          <div style="background: #2563eb; color: white; border-radius: 9999px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; border: 2.5px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);">
            ●
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      routeGroup.addLayer(L.marker(startPoint, { icon: startIcon, zIndexOffset: 1100 }));

      // 3. Draw Submerged Road Hazard marker
      if (region === 'bangladesh') {
        const hazardPoint: [number, number] = [23.1200, 91.4150];
        const hazardMarker = L.circleMarker(hazardPoint, {
          radius: 8,
          color: '#ef4444',
          fillColor: '#fee2e2',
          weight: 2.5,
        }).bindTooltip('<b>BLOCKED ROAD:</b> Grand Trunk Underpass submerged under 1.8m water', {
          permanent: true,
          direction: 'right',
        });
        routeGroup.addLayer(hazardMarker);
      }
    }
  }, [selectedRoute, region]);

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden shadow-xs border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 isolate z-0 transition-colors">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Google Map Layer Switcher (Streets vs Satellite Hybrid) */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 text-xs transition-colors">
        <button
          type="button"
          onClick={() => setMapLayerType('streets')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            mapLayerType === 'streets'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Switch to Google Maps Streets (Auto Dark Mode adapted)"
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Google Map</span>
        </button>

        <button
          type="button"
          onClick={() => setMapLayerType('satellite')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            mapLayerType === 'satellite'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Switch to Google Maps Satellite (Photorealistic Hybrid Imagery)"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>
      </div>

      {/* Collapsible Floating Map Legend */}
      <div className="absolute top-4 right-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 max-w-[220px] transition-all overflow-hidden">
        <button
          type="button"
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          className="w-full px-3 py-2 flex items-center justify-between font-extrabold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left"
          title={isLegendOpen ? 'Collapse map legend' : 'Expand map legend'}
        >
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-600" />
            <span>Map Legend</span>
          </div>
          {isLegendOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {isLegendOpen && (
          <div className="px-3.5 pb-3 pt-1 space-y-1.5 font-medium border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-white dark:border-slate-700 shadow-xs shrink-0"></span>
              <span><b className="text-red-700 dark:text-red-400">Critical</b> (Unattended)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-white dark:border-slate-700 shadow-xs shrink-0"></span>
              <span><b className="text-amber-700 dark:text-amber-400">In-Progress</b> (En Route)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white dark:border-slate-700 shadow-xs shrink-0"></span>
              <span><b className="text-emerald-700 dark:text-emerald-400">Secured</b> (Safe)</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="w-3.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
              <span><b>High Ground Path</b></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-teal-700 text-white text-[9px] flex items-center justify-center font-bold shrink-0">▲</span>
              <span><b>Safe Dry Refuge</b></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
