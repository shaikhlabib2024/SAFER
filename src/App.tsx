import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MapComponent } from './components/MapComponent';
import { RescuerDispatchQueue } from './components/RescuerDispatchQueue';
import { RescuerSectorControl } from './components/RescuerSectorControl';
import { VictimRoutePanel } from './components/VictimRoutePanel';
import { VictimSosPanel } from './components/VictimSosPanel';
import { DemoWalkthroughBar } from './components/DemoWalkthroughBar';
import { AuditReportModal } from './components/AuditReportModal';
import { NasaDatasetsModal } from './components/NasaDatasetsModal';
import type {
  PortalMode,
  Locality,
  Shelter,
  EvacuationRoute,
  LocalityStatus,
  AuditLogEntry,
  ReliefRequest,
} from './types';
import {
  INITIAL_LOCALITIES,
  SHELTERS,
  DEMO_EVACUATION_ROUTES,
  INITIAL_RELIEF_REQUESTS,
} from './data/mockData';
import {
  CloudRain,
  Satellite,
  PanelLeftOpen,
  PanelRightOpen,
  Maximize2,
  Minimize2,
  Crosshair,
} from 'lucide-react';

export function App() {
  const [portalMode, setPortalMode] = useState<PortalMode>('rescuer');
  const [selectedRegion, setSelectedRegion] = useState<'bangladesh' | 'nepal'>('bangladesh');
  const [localities, setLocalities] = useState<Locality[]>(INITIAL_LOCALITIES);
  const [shelters] = useState<Shelter[]>(SHELTERS);
  const [selectedRoute, setSelectedRoute] = useState<EvacuationRoute | null>(null);
  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isNasaModalOpen, setIsNasaModalOpen] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [reliefRequests, setReliefRequests] = useState<ReliefRequest[]>(INITIAL_RELIEF_REQUESTS);

  // Rescuer Active Team State
  const [teamName, setTeamName] = useState<string>('Red Crescent Response Alpha');

  // Real-time Live & Demo States (Defaults to Live GPS Mode on website open)
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [userLiveLocation, setUserLiveLocation] = useState<[number, number] | null>(null);
  const [liveEventNotice, setLiveEventNotice] = useState<string | null>(null);

  // Layout Minimization States
  const [isLeftMinimized, setIsLeftMinimized] = useState<boolean>(false);
  const [isRightMinimized, setIsRightMinimized] = useState<boolean>(false);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

  // NASA Layer Toggles
  const [showRainRadar, setShowRainRadar] = useState<boolean>(true);
  const [showElevationContour] = useState<boolean>(true);

  // Filter localities and relief requests for current active region
  const regionalLocalities = localities.filter((l) => l.region === selectedRegion);
  const regionalReliefRequests = reliefRequests.filter((r) => r.region === selectedRegion);
  const regionalSecuredCount = regionalLocalities.filter((l) => l.status === 'secured').length;
  const regionalCriticalCount = regionalLocalities.filter((l) => l.status === 'critical').length;
  const regionalPendingSosCount = regionalReliefRequests.filter((r) => r.status === 'pending').length;
  const totalUnattendedCount = regionalCriticalCount + regionalPendingSosCount;
  const securedPercentage =
    regionalLocalities.length > 0
      ? Math.round((regionalSecuredCount / regionalLocalities.length) * 100)
      : 0;

  // On Initial Mount: Obtain User's Live Location Immediately for Real-Time Rescue Map
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLiveLocation([pos.coords.latitude, pos.coords.longitude]);
          setLiveEventNotice(`📍 Live GPS Locked: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
        },
        () => {
          // Fallback location in active disaster sector
          const fallbackLat = selectedRegion === 'bangladesh' ? 23.1450 : 27.6820;
          const fallbackLng = selectedRegion === 'bangladesh' ? 91.4100 : 85.3050;
          setUserLiveLocation([fallbackLat, fallbackLng]);
          setLiveEventNotice('📍 Live GPS Surveillance Active (Field Tactical Beacon)');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  // Real-time Live Stream Event Simulation
  useEffect(() => {
    if (!isLiveMode) {
      return;
    }

    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      const timeStr = new Date().toLocaleTimeString();
      const events = [
        `[${timeStr}] 📡 NASA GPM IMERG scan: 74.2 mm/hr cloud cell detected over basin.`,
        `[${timeStr}] 🚨 Inbound distress call from Fulgazi sector — civilians stranded.`,
        `[${timeStr}] 🟡 Red Crescent Speedboat Unit Alpha en route to Sector 2.`,
        `[${timeStr}] 🟢 Navy Rescue Unit safely evacuated 12 infants & elderly to College Shelter.`,
        `[${timeStr}] 💧 Soil saturation index (NASA SMAP): 95.8% (Maximum runoff warning).`,
      ];
      const currentEvt = events[tick % events.length];
      setLiveEventNotice(currentEvt);

      setTimeout(() => {
        setLiveEventNotice(null);
      }, 5000);
    }, 12000);

    return () => clearInterval(interval);
  }, [isLiveMode, selectedRegion]);

  // Recenter GPS Button Action
  const handleRecenterGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLiveLocation([pos.coords.latitude, pos.coords.longitude]);
          setLiveEventNotice(`📍 Centered on GPS: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
        },
        () => {
          const fallbackLat = selectedRegion === 'bangladesh' ? 23.1450 : 27.6820;
          const fallbackLng = selectedRegion === 'bangladesh' ? 91.4100 : 85.3050;
          setUserLiveLocation([fallbackLat, fallbackLng]);
          setLiveEventNotice('📍 Centered on Field Surveillance Beacon');
        }
      );
    }
  };

  // Handle Route Calculation for Victim Portal
  const handleCalculateRoute = () => {
    const route = DEMO_EVACUATION_ROUTES[selectedRegion];
    if (route) {
      setSelectedRoute(route);
    }
  };

  // Handle Relief Request from Victim Portal (Creates real-time distress beacon)
  const handleRequestRelief = (data: any) => {
    const isBd = selectedRegion === 'bangladesh';
    const newSos: ReliefRequest = {
      id: `sos-${Date.now()}`,
      region: selectedRegion,
      localityName: isBd ? 'Fulgazi Low Basin (Civilian Beacon)' : 'Balkhu Riverside (Civilian Beacon)',
      lat: userLiveLocation ? userLiveLocation[0] : (isBd ? 23.1670 : 27.6850),
      lng: userLiveLocation ? userLiveLocation[1] : (isBd ? 91.4120 : 85.2950),
      contactNumber: data.contactNumber || (isBd ? '+880 1819-223344' : '+977 9841-112233'),
      peopleCount: data.peopleCount || 4,
      hasInjured: data.hasInjured || false,
      hasInfantsOrElderly: data.hasInfantsOrElderly || false,
      needsBoat: data.needsBoat || false,
      needsFoodAndWater: data.needsFoodAndWater || false,
      status: 'pending',
      timestamp: 'Just now',
    };

    setReliefRequests((prev) => [newSos, ...prev]);
    setLiveEventNotice(`🚨 NEW DISTRESS BEACON: ${newSos.peopleCount} people stranded in ${newSos.localityName}!`);

    const matchingLoc = regionalLocalities.find((l) => l.status === 'critical');
    if (matchingLoc) {
      setSelectedLocality(matchingLoc);
    }
  };

  // Handle Rescue Dispatch Acknowledgment from Rescuer Portal
  const handleAcknowledgeRequest = (requestId: string, respondingTeam: string) => {
    setReliefRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: 'dispatched', assignedTeam: respondingTeam } : req
      )
    );
    setLiveEventNotice(`🚤 Rescue unit dispatched: ${respondingTeam} en route!`);
  };

  // Handle Status Update from Rescuer Portal (Red -> Yellow -> Green)
  const handleUpdateLocalityStatus = (
    localityId: string,
    newStatus: LocalityStatus,
    rescuedCountDelta: number,
    foodDelta: number,
    waterDelta: number,
    medical: boolean,
    respondingTeam: string,
    actionNote: string
  ) => {
    setLocalities((prev) =>
      prev.map((loc) => {
        if (loc.id === localityId) {
          return {
            ...loc,
            status: newStatus,
            rescuedCount: loc.rescuedCount + rescuedCountDelta,
            trappedCount: Math.max(0, loc.trappedCount - rescuedCountDelta),
            reliefPacksDelivered: loc.reliefPacksDelivered + foodDelta,
            waterKitsDelivered: loc.waterKitsDelivered + waterDelta,
            medicalAssistanceGiven: medical || loc.medicalAssistanceGiven,
            assignedTeam: respondingTeam,
            lastUpdated: 'Just now',
          };
        }
        return loc;
      })
    );

    // Append to audit trail
    const targetLoc = localities.find((l) => l.id === localityId);
    if (targetLoc) {
      const newEntry: AuditLogEntry = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        localityId,
        localityName: targetLoc.name,
        teamName: respondingTeam,
        actionTaken: actionNote,
        peopleRescued: rescuedCountDelta,
        foodDelivered: foodDelta,
        waterDelivered: waterDelta,
        statusChangedTo: newStatus,
      };
      setAuditLogs((prev) => [newEntry, ...prev]);

      // Update selectedLocality reference
      setSelectedLocality({
        ...targetLoc,
        status: newStatus,
        rescuedCount: targetLoc.rescuedCount + rescuedCountDelta,
        trappedCount: Math.max(0, targetLoc.trappedCount - rescuedCountDelta),
        reliefPacksDelivered: targetLoc.reliefPacksDelivered + foodDelta,
        waterKitsDelivered: targetLoc.waterKitsDelivered + waterDelta,
      });
    }
  };

  // Determine Column Spans based on Minimization
  const showLeft = !isMapExpanded && !isLeftMinimized;
  const showRight = !isMapExpanded && !isRightMinimized;

  let centerColSpan = 'lg:col-span-6 xl:col-span-6';
  if (isMapExpanded || (!showLeft && !showRight)) {
    centerColSpan = 'lg:col-span-12';
  } else if (!showLeft && showRight) {
    centerColSpan = 'lg:col-span-8 xl:col-span-8';
  } else if (showLeft && !showRight) {
    centerColSpan = 'lg:col-span-8 xl:col-span-8';
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-sky-50/40 to-teal-50/30">
      {/* 1. Global Navigation Bar */}
      <Navbar
        portalMode={portalMode}
        setPortalMode={setPortalMode}
        selectedRegion={selectedRegion}
        setSelectedRegion={(region) => {
          setSelectedRegion(region);
          setSelectedRoute(null);
          setSelectedLocality(null);
        }}
        isLiveMode={isLiveMode}
        setIsLiveMode={(live) => {
          setIsLiveMode(live);
          if (live) setIsDemoMode(false);
        }}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenNasaModal={() => setIsNasaModalOpen(true)}
        securedPercentage={securedPercentage}
      />

      {/* 2. Interactive Demo Simulation Guide Banner (Shown when user clicks Demo Scenarios) */}
      {isDemoMode && (
        <div className="max-w-[1700px] w-full mx-auto px-3 sm:px-4 pt-2">
          <DemoWalkthroughBar
            selectedRegion={selectedRegion}
            onSelectRegion={(region) => {
              setSelectedRegion(region);
              setSelectedRoute(null);
              setSelectedLocality(null);
            }}
            onExitDemo={() => {
              setIsDemoMode(false);
              setIsLiveMode(true);
            }}
            portalMode={portalMode}
            onSwitchPortal={setPortalMode}
          />
        </div>
      )}

      {/* 3. Main 3-Column Command Dashboard (Map in the Square Center, Distributed Side Panels) */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-2 sm:p-3 md:p-3.5 grid grid-cols-1 lg:grid-cols-12 gap-3 relative lg:h-[calc(100vh-5rem)] lg:overflow-hidden">
        {/* === COLUMN 1: LEFT PANEL (SOS Queue for Rescuer / Safe Route for Victim) === */}
        {showLeft && (
          <aside className="lg:col-span-3 xl:col-span-3 flex flex-col h-full min-h-0 order-2 lg:order-1 transition-all">
            {portalMode === 'rescuer' ? (
              <RescuerDispatchQueue
                reliefRequests={regionalReliefRequests}
                onAcknowledgeRequest={handleAcknowledgeRequest}
                activeTeamName={teamName}
                onMinimize={() => setIsLeftMinimized(true)}
              />
            ) : (
              <VictimRoutePanel
                region={selectedRegion}
                shelters={shelters}
                evacuationRoute={selectedRoute}
                onCalculateRoute={handleCalculateRoute}
                onMinimize={() => setIsLeftMinimized(true)}
              />
            )}
          </aside>
        )}

        {/* === COLUMN 2: CENTER SECTION (SQUARE TACTICAL RESCUE MAP) === */}
        <section
          className={`${centerColSpan} flex flex-col gap-2 order-1 lg:order-2 transition-all duration-300 relative h-full min-h-[480px] lg:min-h-0`}
        >
          {/* Top Map Context & Real-Time Controls Ribbon */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-700 shadow-xs shrink-0">
            {/* Left Status: Live vs Demo Scenario */}
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isDemoMode ? 'bg-amber-500 animate-ping' : 'bg-red-600 animate-pulse'}`}></span>
              <span className="font-bold text-slate-900 text-xs">
                {isDemoMode ? (
                  <span>
                    Demo: <b>{selectedRegion === 'bangladesh' ? 'Feni & Muhuri River Flood Surge' : 'Kathmandu Valley Flash Floods'}</b>
                  </span>
                ) : (
                  <span className="text-red-700 flex items-center gap-1">
                    <b>LIVE RESCUE RADAR</b>
                    {userLiveLocation && (
                      <span className="text-slate-500 font-normal hidden sm:inline">
                        ({userLiveLocation[0].toFixed(3)}°N, {userLiveLocation[1].toFixed(3)}°E)
                      </span>
                    )}
                  </span>
                )}
              </span>
            </div>

            {/* Right Action Controls: GPS Recenter, Rain, Datasets, Expand */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Notification: Unattended Calls (Rescuer only) */}
              {portalMode === 'rescuer' && (
                <button
                  onClick={() => setIsLeftMinimized(false)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-xs font-black transition-all shadow-xs cursor-pointer group"
                  title={`${totalUnattendedCount} unattended emergency calls`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                  <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-black">
                    {totalUnattendedCount}
                  </span>
                  <span className="hidden sm:inline">Unattended</span>
                </button>
              )}

              {/* Recenter on GPS */}
              <button
                onClick={handleRecenterGps}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                title="Recenter map to your live GPS coordinates"
              >
                <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">My GPS</span>
              </button>

              {/* GPM Rain Radar Toggle (HIGHLIGHTED) */}
              <button
                onClick={() => setShowRainRadar(!showRainRadar)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  showRainRadar
                    ? 'bg-sky-50 border-sky-300 text-sky-800 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
                title="Toggle NASA GPM IMERG 30-min Rain Radar"
              >
                <CloudRain className={`w-3.5 h-3.5 ${showRainRadar ? 'text-sky-600' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">GPM Rain</span>
              </button>

              {/* NASA Datasets Inspector Button */}
              <button
                onClick={() => setIsNasaModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                title="Inspect authentic NASA Earth Science datasets"
              >
                <Satellite className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden md:inline">NASA Data</span>
              </button>

              {/* Expand / Minimize Full Map Toggle */}
              <button
                onClick={() => {
                  const newExpanded = !isMapExpanded;
                  setIsMapExpanded(newExpanded);
                  if (newExpanded) {
                    setIsLeftMinimized(true);
                    setIsRightMinimized(true);
                  } else {
                    setIsLeftMinimized(false);
                    setIsRightMinimized(false);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                title={isMapExpanded ? 'Restore 3-column layout' : 'Maximize map full-screen'}
              >
                {isMapExpanded ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-slate-600" />
                    <span className="hidden md:inline">Restore</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
                    <span className="hidden md:inline">Square Map</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Square Map Container Viewport */}
          <div className="relative flex-1 w-full h-full min-h-0 rounded-2xl overflow-hidden shadow-xs border border-slate-200">
            {/* Floating Left Pill if Left Panel is Minimized */}
            {isLeftMinimized && (
              <div className="absolute top-4 left-4 z-20">
                <button
                  onClick={() => {
                    setIsLeftMinimized(false);
                    setIsMapExpanded(false);
                  }}
                  className="bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <PanelLeftOpen className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
                  <span>{portalMode === 'rescuer' ? 'SOS Queue' : 'Safe Route'}</span>
                  {portalMode === 'rescuer' && totalUnattendedCount > 0 && (
                    <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                      {totalUnattendedCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Floating Right Pill if Right Panel is Minimized */}
            {isRightMinimized && (
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => {
                    setIsRightMinimized(false);
                    setIsMapExpanded(false);
                  }}
                  className="bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <span>{portalMode === 'rescuer' ? 'Sector Control' : 'Send SOS'}</span>
                  <PanelRightOpen className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            )}

            {/* Real-Time Live Stream Alert Toast */}
            {liveEventNotice && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 text-white px-4 py-2 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold backdrop-blur-md flex items-center gap-2 animate-bounce">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>{liveEventNotice}</span>
              </div>
            )}

            <MapComponent
              region={selectedRegion}
              localities={regionalLocalities}
              shelters={shelters}
              reliefRequests={regionalReliefRequests}
              selectedRoute={selectedRoute}
              activeLocalityId={selectedLocality?.id || null}
              onSelectLocality={(loc) => {
                setSelectedLocality(loc);
                if (portalMode === 'victim') {
                  handleCalculateRoute();
                }
              }}
              portalMode={portalMode}
              showRainRadar={showRainRadar}
              showElevationContour={showElevationContour}
              userLiveLocation={userLiveLocation}
              isPanelMinimized={isMapExpanded}
            />
          </div>
        </section>

        {/* === COLUMN 3: RIGHT PANEL (Sector Triage for Rescuer / SOS Broadcast for Victim) === */}
        {showRight && (
          <aside className="lg:col-span-3 xl:col-span-3 flex flex-col h-full min-h-0 order-3 transition-all">
            {portalMode === 'rescuer' ? (
              <RescuerSectorControl
                localities={regionalLocalities}
                selectedLocality={selectedLocality}
                onSelectLocality={(loc) => setSelectedLocality(loc)}
                onUpdateLocalityStatus={handleUpdateLocalityStatus}
                teamName={teamName}
                setTeamName={setTeamName}
                onOpenAuditModal={() => setIsAuditModalOpen(true)}
                onMinimize={() => setIsRightMinimized(true)}
              />
            ) : (
              <VictimSosPanel
                region={selectedRegion}
                onRequestRelief={handleRequestRelief}
                onMinimize={() => setIsRightMinimized(true)}
              />
            )}
          </aside>
        )}
      </main>

      {/* 4. Official Audit Report SitRep Modal */}
      <AuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        localities={regionalLocalities}
        auditLogs={auditLogs}
        region={selectedRegion}
      />

      {/* 5. NASA Datasets & Scientific Verification Modal */}
      <NasaDatasetsModal
        isOpen={isNasaModalOpen}
        onClose={() => setIsNasaModalOpen(false)}
        region={selectedRegion}
      />
    </div>
  );
}

export default App;
