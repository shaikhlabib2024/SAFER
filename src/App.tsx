import { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { MapComponent } from './components/MapComponent';
import { RescuerDispatchQueue } from './components/RescuerDispatchQueue';
import { RescuerSectorControl } from './components/RescuerSectorControl';
import { VictimRoutePanel } from './components/VictimRoutePanel';
import { VictimSosPanel } from './components/VictimSosPanel';
import { DemoWalkthroughBar } from './components/DemoWalkthroughBar';
import { AuditReportModal } from './components/AuditReportModal';
import { NasaDatasetsModal } from './components/NasaDatasetsModal';
import { AccessibilityModal, type ThemeMode, type TextSize } from './components/AccessibilityModal';
import { HotlinesModal } from './components/HotlinesModal';
import { SimplifiedCrisisView } from './components/SimplifiedCrisisView';
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
  PhoneCall,
  SlidersHorizontal,
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

  // Accessibility & Dark Mode State (Ages 10 to 80+)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('safer_theme');
    return (saved as ThemeMode) || 'system';
  });

  const [textSize, setTextSize] = useState<TextSize>(() => {
    const saved = localStorage.getItem('safer_text_size');
    return (saved as TextSize) || 'normal';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('safer_high_contrast') === 'true';
  });

  const [simplifiedMode, setSimplifiedMode] = useState<boolean>(() => {
    return localStorage.getItem('safer_simplified_mode') === 'true';
  });

  const [isBeaconActive, setIsBeaconActive] = useState<boolean>(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState<boolean>(false);
  const [isHotlinesModalOpen, setIsHotlinesModalOpen] = useState<boolean>(false);

  // Active theme calculation (Dark / Light)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

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

  // Filter localities and relief requests for current active region (memoized to keep references stable)
  const regionalLocalities = useMemo(
    () => localities.filter((l) => l.region === selectedRegion),
    [localities, selectedRegion]
  );
  const regionalReliefRequests = useMemo(
    () => reliefRequests.filter((r) => r.region === selectedRegion),
    [reliefRequests, selectedRegion]
  );
  const regionalSecuredCount = regionalLocalities.filter((l) => l.status === 'secured').length;
  const regionalCriticalCount = regionalLocalities.filter((l) => l.status === 'critical').length;
  const regionalPendingSosCount = regionalReliefRequests.filter((r) => r.status === 'pending').length;
  const totalUnattendedCount = regionalCriticalCount + regionalPendingSosCount;
  const securedPercentage =
    regionalLocalities.length > 0
      ? Math.round((regionalSecuredCount / regionalLocalities.length) * 100)
      : 0;

  // Handle Theme Preference Changes & System Media Query
  useEffect(() => {
    localStorage.setItem('safer_theme', theme);

    const updateTheme = () => {
      let activeDark = false;
      if (theme === 'dark') {
        activeDark = true;
      } else if (theme === 'light') {
        activeDark = false;
      } else {
        activeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDark(activeDark);
      if (activeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  // Handle Text Sizing (Normal, Large, Extra Large)
  useEffect(() => {
    localStorage.setItem('safer_text_size', textSize);
    document.documentElement.setAttribute('data-text-size', textSize);
  }, [textSize]);

  // Handle High Contrast Mode
  useEffect(() => {
    localStorage.setItem('safer_high_contrast', String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Handle Simplified Mode Persistence
  useEffect(() => {
    localStorage.setItem('safer_simplified_mode', String(simplifiedMode));
  }, [simplifiedMode]);

  // Direct 1-Click Dark Mode Toggle
  const handleToggleDarkMode = () => {
    if (isDark) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  // On Initial Mount: Obtain User's Live Location Immediately for Real-Time Rescue Map
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLiveLocation([pos.coords.latitude, pos.coords.longitude]);
          setLiveEventNotice(`📍 Live GPS Locked: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
        },
        () => {
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
  const handleCalculateRoute = useCallback(() => {
    const route = DEMO_EVACUATION_ROUTES[selectedRegion];
    if (route) {
      setSelectedRoute(route);
    }
  }, [selectedRegion]);

  // Stable callback for map locality selection
  const handleSelectLocality = useCallback(
    (loc: Locality) => {
      setSelectedLocality(loc);
      if (portalMode === 'victim') {
        handleCalculateRoute();
      }
    },
    [portalMode, handleCalculateRoute]
  );

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

  // Common Map Element reused across full and simplified views
  const mapElement = (
    <MapComponent
      region={selectedRegion}
      localities={regionalLocalities}
      shelters={shelters}
      reliefRequests={regionalReliefRequests}
      selectedRoute={selectedRoute}
      activeLocalityId={selectedLocality?.id || null}
      onSelectLocality={handleSelectLocality}
      portalMode={portalMode}
      showRainRadar={showRainRadar}
      showElevationContour={showElevationContour}
      userLiveLocation={userLiveLocation}
      isPanelMinimized={isMapExpanded}
      isDarkMode={isDark}
    />
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-sky-50/40 to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Global Navigation Bar with Dark Mode & Accessibility Controls */}
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
        isDarkMode={isDark}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
        onOpenHotlines={() => setIsHotlinesModalOpen(true)}
        simplifiedMode={simplifiedMode}
        onToggleSimplifiedMode={() => setSimplifiedMode(!simplifiedMode)}
      />

      {/* 2. Interactive Demo Simulation Guide Banner */}
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

      {/* 3. VIEW MODE SELECTION: Simplified Senior & Junior Mode vs Full 3-Column Tactical Dashboard */}
      {simplifiedMode ? (
        <SimplifiedCrisisView
          region={selectedRegion}
          shelters={shelters}
          evacuationRoute={selectedRoute}
          onCalculateRoute={handleCalculateRoute}
          onRequestRelief={handleRequestRelief}
          onOpenHotlines={() => setIsHotlinesModalOpen(true)}
          onExitSimplifiedMode={() => setSimplifiedMode(false)}
          isBeaconActive={isBeaconActive}
          setIsBeaconActive={setIsBeaconActive}
          mapElement={mapElement}
        />
      ) : (
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
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs shrink-0 transition-colors">
              {/* Left Status: Live vs Demo Scenario */}
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isDemoMode ? 'bg-amber-500 animate-ping' : 'bg-red-600 animate-pulse'}`}></span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  {isDemoMode ? (
                    <span>
                      Demo: <b>{selectedRegion === 'bangladesh' ? 'Feni & Muhuri River Flood Surge' : 'Kathmandu Valley Flash Floods'}</b>
                    </span>
                  ) : (
                    <span className="text-red-700 dark:text-red-400 flex items-center gap-1">
                      <b>LIVE RESCUE RADAR</b>
                      {userLiveLocation && (
                        <span className="text-slate-500 dark:text-slate-400 font-normal hidden sm:inline">
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
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900/80 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-black transition-all shadow-xs cursor-pointer group"
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
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                  title="Recenter map to your live GPS coordinates"
                >
                  <Crosshair className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="hidden sm:inline">My GPS</span>
                </button>

                {/* GPM Rain Radar Toggle */}
                <button
                  onClick={() => setShowRainRadar(!showRainRadar)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                    showRainRadar
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-700 text-sky-800 dark:text-sky-200 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                  title="Toggle NASA GPM IMERG 30-min Rain Radar"
                >
                  <CloudRain className={`w-3.5 h-3.5 ${showRainRadar ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">GPM Rain</span>
                </button>

                {/* NASA Datasets Inspector Button */}
                <button
                  onClick={() => setIsNasaModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                  title="Inspect authentic NASA Earth Science datasets"
                >
                  <Satellite className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
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
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-all cursor-pointer"
                  title={isMapExpanded ? 'Restore 3-column layout' : 'Maximize map full-screen'}
                >
                  {isMapExpanded ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      <span className="hidden md:inline">Restore</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      <span className="hidden md:inline">Square Map</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Square Map Container Viewport */}
            <div className="relative flex-1 w-full h-full min-h-0 rounded-2xl overflow-hidden shadow-xs border border-slate-200 dark:border-slate-800">
              {/* Floating Left Pill if Left Panel is Minimized */}
              {isLeftMinimized && (
                <div className="absolute top-4 left-4 z-20">
                  <button
                    onClick={() => {
                      setIsLeftMinimized(false);
                      setIsMapExpanded(false);
                    }}
                    className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group"
                  >
                    <PanelLeftOpen className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
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
                    className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group"
                  >
                    <span>{portalMode === 'rescuer' ? 'Sector Control' : 'Send SOS'}</span>
                    <PanelRightOpen className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}

              {/* Real-Time Live Stream Alert Toast (Non-blocking status pill) */}
              {liveEventNotice && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 max-w-[85%] sm:max-w-md bg-slate-900/95 dark:bg-slate-950/95 text-white px-3.5 py-1.5 rounded-full shadow-xl border border-slate-700/80 text-xs font-semibold backdrop-blur-md flex items-center gap-2 pointer-events-none transition-all">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0"></span>
                  <span className="truncate">{liveEventNotice}</span>
                </div>
              )}

              {mapElement}
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
                  onOpenHotlines={() => setIsHotlinesModalOpen(true)}
                />
              )}
            </aside>
          )}
        </main>
      )}

      {/* 4. Floating Emergency & Accessibility Assistant Action Bar (Ages 10-80 Quick Access) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        {/* Quick Dial 999 Button */}
        <button
          onClick={() => setIsHotlinesModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-xl ring-2 ring-red-400/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="1-Tap Emergency Hotlines (999 / 1090)"
        >
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span className="hidden sm:inline">Emergency 999</span>
        </button>

        {/* Quick Accessibility & Senior Settings FAB */}
        <button
          onClick={() => setIsAccessibilityModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs shadow-xl border border-slate-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Display, Text Size & Senior/Junior Mode Settings"
          aria-label="Display & Accessibility Settings"
        >
          <SlidersHorizontal className="w-4 h-4 text-teal-400" />
          <span className="hidden md:inline">Accessibility</span>
        </button>
      </div>

      {/* 5. Modals Container */}
      <AuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        localities={regionalLocalities}
        auditLogs={auditLogs}
        region={selectedRegion}
      />

      <NasaDatasetsModal
        isOpen={isNasaModalOpen}
        onClose={() => setIsNasaModalOpen(false)}
        region={selectedRegion}
      />

      <AccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
        theme={theme}
        onSetTheme={setTheme}
        textSize={textSize}
        onSetTextSize={setTextSize}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        simplifiedMode={simplifiedMode}
        onToggleSimplifiedMode={() => setSimplifiedMode(!simplifiedMode)}
        isBeaconActive={isBeaconActive}
        setIsBeaconActive={setIsBeaconActive}
        onOpenHotlines={() => setIsHotlinesModalOpen(true)}
      />

      <HotlinesModal
        isOpen={isHotlinesModalOpen}
        onClose={() => setIsHotlinesModalOpen(false)}
        region={selectedRegion}
      />
    </div>
  );
}

export default App;
