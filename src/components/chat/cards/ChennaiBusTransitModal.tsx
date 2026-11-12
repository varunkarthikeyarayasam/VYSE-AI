"use client";

import React, { useState, useMemo } from "react";
import {
  Bus,
  MapPin,
  Phone,
  Search,
  ExternalLink,
  X,
  Maximize2,
  Minimize2,
  Navigation,
  Clock,
  Shield,
  Layers,
  Sparkles,
  ChevronRight,
  Info,
  Calendar,
} from "lucide-react";
import {
  SATHYABAMA_BUS_ROUTES,
  SathyabamaBusRoute,
  SathyabamaBusStop,
  SATHYABAMA_CAMPUS_LOCATION,
} from "../../../data/sathyabamaBusRoutes";

interface ChennaiBusTransitModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRouteNo?: string;
  initialStop?: string;
}

const ZONES = [
  "All Zones",
  "Tambaram & GST",
  "OMR & Velachery",
  "ECR Coastal",
  "Central Chennai",
  "West Chennai (Porur/Guindy)",
  "North Chennai",
  "Outer Suburbs",
] as const;

export function ChennaiBusTransitModal({
  isOpen,
  onClose,
  initialRouteNo,
  initialStop,
}: ChennaiBusTransitModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialStop || "");
  const [selectedZone, setSelectedZone] = useState<string>("All Zones");
  const [mapType, setMapType] = useState<"standard" | "satellite">("satellite");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Selected Route state
  const [selectedRoute, setSelectedRoute] = useState<SathyabamaBusRoute>(() => {
    if (initialRouteNo) {
      const match = SATHYABAMA_BUS_ROUTES.find(
        (r) => r.routeNo.toLowerCase() === initialRouteNo.toLowerCase()
      );
      if (match) return match;
    }
    return SATHYABAMA_BUS_ROUTES[0];
  });

  // Selected Stop to focus on map
  const [selectedStop, setSelectedStop] = useState<SathyabamaBusStop>(() => {
    return selectedRoute.stops[0];
  });

  // Keep selected stop in sync if route changes
  const handleSelectRoute = (route: SathyabamaBusRoute) => {
    setSelectedRoute(route);
    setSelectedStop(route.stops[0]);
  };

  // Filter routes based on search query and zone
  const filteredRoutes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SATHYABAMA_BUS_ROUTES.filter((r) => {
      if (selectedZone !== "All Zones" && r.zone !== selectedZone) {
        return false;
      }
      if (!q) return true;
      return (
        r.routeNo.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) ||
        r.driverName.toLowerCase().includes(q) ||
        r.vehicleNo.toLowerCase().includes(q) ||
        r.viaStops.some((s) => s.toLowerCase().includes(q)) ||
        r.stops.some((s) => s.name.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedZone]);

  if (!isOpen) return null;

  // Active coordinates for the Google Map iframe
  const mapLat = selectedStop.lat;
  const mapLng = selectedStop.lng;
  const mapLabel = encodeURIComponent(
    `Sathyabama Bus Route ${selectedRoute.routeNo} - ${selectedStop.name}`
  );

  // Google Maps Free Keyless Embed with Satellite (t=k) and Roadmap (t=m)
  const embedUrl = `https://maps.google.com/maps?q=${mapLat},${mapLng}+(${mapLabel})&t=${
    mapType === "satellite" ? "k" : "m"
  }&z=15&ie=UTF8&iwloc=B&output=embed`;

  // External live navigation to Campus or selected stop
  const directMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${mapLat},${mapLng}&destination=${SATHYABAMA_CAMPUS_LOCATION.lat},${SATHYABAMA_CAMPUS_LOCATION.lng}&travelmode=transit`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 animate-in fade-in duration-200">
      <div
        className={`relative w-full bg-[var(--bg-surface)] border border-hairline-strong rounded-lg overflow-hidden flex flex-col transition-all duration-300 ${
          isFullscreen ? "h-[98vh] max-w-[98vw]" : "h-[90vh] max-w-7xl"
        }`}
      >
        {/* Top Header */}
        <div className="px-4 py-3 bg-[var(--bg-surface-2)] border-b border-hairline flex items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-[var(--bg-base)] border border-hairline flex items-center justify-center shrink-0 text-[var(--text-primary)]">
              <Bus className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-mono font-semibold text-sm sm:text-base text-[var(--text-primary)] tracking-wide uppercase">
                  Sathyabama Transport • Chennai Metropolitan Transit
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-base)] text-[var(--text-secondary)] border border-hairline font-medium flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5 text-[var(--text-tertiary)]" /> Circular: 28/08/2026
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-base)] text-[var(--text-secondary)] border border-hairline font-medium flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-[var(--text-tertiary)]" /> In-Time: 08:30 AM
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] truncate">
                175 Official College Bus Routes connecting Greater Chennai, Chengalpattu, Kanchipuram & Thiruvallur to Jeppiaar Nagar
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Satellite / Roadmap Switcher */}
            <div className="flex items-center bg-[#151C2C] border border-cyan-800/40 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setMapType("standard")}
                className={`px-2.5 py-1 rounded-lg transition-all text-xs font-medium flex items-center gap-1 ${
                  mapType === "standard"
                    ? "bg-cyan-600 text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3 h-3" /> Roadmap
              </button>
              <button
                type="button"
                onClick={() => setMapType("satellite")}
                className={`px-2.5 py-1 rounded-lg transition-all text-xs font-medium flex items-center gap-1 ${
                  mapType === "satellite"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3 h-3" /> Satellite 3D
              </button>
            </div>

            {/* External Direct Link */}
            <a
              href={directMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/40 text-cyan-300 text-xs font-medium transition-colors"
              title="Open Directions in Google Maps"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Transit GPS</span>
            </a>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl bg-[#151C2C] border border-slate-700/60 text-slate-400 hover:text-white transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#151C2C] border border-slate-700/60 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
              title="Close Transit Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Column: Routes List & Filter (4 cols on lg) */}
          <div className="lg:col-span-4 border-r border-cyan-950 flex flex-col bg-[#090D15] min-h-0">
            {/* Search Box */}
            <div className="p-3 border-b border-slate-800/80 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search 175 routes, stop, driver, plate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#131926] border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Zone Filter Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                {ZONES.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-lg font-medium transition-all ${
                      selectedZone === zone
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                        : "bg-[#111723] text-slate-400 hover:text-slate-200 border border-slate-800/60"
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="px-3 py-1.5 bg-[#0C121E] border-b border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400">
              <span>Showing {filteredRoutes.length} of 175 Bus Routes</span>
              <span className="text-cyan-400 font-mono">College Bus Fleet</span>
            </div>

            {/* Scrollable Route List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
              {filteredRoutes.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <Bus className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No bus routes found matching &ldquo;{searchQuery}&rdquo;</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedZone("All Zones");
                    }}
                    className="mt-3 text-cyan-400 underline hover:text-cyan-300"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                filteredRoutes.map((route) => {
                  const isSelected = selectedRoute.slNo === route.slNo;
                  return (
                    <div
                      key={route.slNo}
                      onClick={() => handleSelectRoute(route)}
                      className={`p-3 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-cyan-950/40 to-blue-950/20 border-l-4 border-cyan-400 pl-2.5"
                          : "hover:bg-[#101622]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-xs font-mono ${
                              isSelected
                                ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30"
                                : "bg-slate-800 text-cyan-300 border border-slate-700"
                            }`}
                          >
                            Route {route.routeNo}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            #{route.slNo}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {route.departureTime}
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{route.origin}</span>
                        <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="text-cyan-400 truncate text-[11px]">Sathyabama Campus</span>
                      </div>

                      <p className="mt-1 text-[11px] text-slate-400 truncate">
                        Via: {route.viaStops.slice(0, 3).join(", ")}
                        {route.viaStops.length > 3 ? "..." : ""}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/40">
                        <span className="font-mono text-slate-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                          {route.vehicleNo}
                        </span>
                        <span className="text-slate-400 truncate max-w-[130px]">
                          Driver: {route.driverName}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Google Maps & Route Details (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col min-h-0 bg-[#070B12]">
            {/* Top Bar above map with selected route quick facts */}
            <div className="p-3 bg-[#0B101C] border-b border-cyan-950/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm tracking-wide shadow-md">
                  Route {selectedRoute.routeNo}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>{selectedRoute.origin}</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-cyan-400">Sathyabama Campus (Jeppiaar Nagar)</span>
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                    <span className="text-indigo-300 bg-indigo-950/50 px-2 py-0.2 rounded border border-indigo-900/40">
                      {selectedRoute.zone}
                    </span>
                    <span>•</span>
                    <span className="text-slate-300">Vehicle: {selectedRoute.vehicleNo}</span>
                    <span>•</span>
                    <span className="text-amber-300 font-mono">
                      Departure: {selectedRoute.departureTime}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-300 font-mono">
                      Campus Arrival: {selectedRoute.campusInTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Call Driver Button */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedRoute.phoneNumber}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-700/50 text-emerald-300 text-xs font-semibold transition-all shadow-sm"
                  title="Call Bus Driver"
                >
                  <Phone className="w-3.5 h-3.5 animate-bounce" />
                  <span>Call {selectedRoute.driverName}</span>
                </a>
              </div>
            </div>

            {/* Interactive Map & Timeline Split */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
              {/* Google Maps Embed (7 cols on md) */}
              <div className="md:col-span-7 relative h-64 md:h-full bg-black flex flex-col">
                <iframe
                  title={`Google Map - ${selectedStop.name}`}
                  src={embedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />

                {/* Floating GPS Target Overlay */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs text-white shadow-xl flex items-center gap-2 z-10 pointer-events-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <div>
                    <p className="font-semibold text-cyan-300 leading-tight">{selectedStop.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {selectedStop.lat.toFixed(4)}°N, {selectedStop.lng.toFixed(4)}°E • {mapType.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Map Footer Banner */}
                <div className="p-2 bg-[#090E18]/95 border-t border-cyan-950 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Click any stop on the right to focus the map pin</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span>GPS Transit Verified</span>
                  </div>
                </div>
              </div>

              {/* Stops Timeline & Info (5 cols on md) */}
              <div className="md:col-span-5 flex flex-col bg-[#0C111C] border-l border-slate-800/80 min-h-0">
                <div className="p-3 bg-[#0F1626] border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    Boarding Stops & Timing ({selectedRoute.stops.length})
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                    Tap stop to preview
                  </span>
                </div>

                {/* Timeline List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {selectedRoute.stops.map((stop, idx) => {
                    const isCurrent = selectedStop.name === stop.name;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedStop(stop)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isCurrent
                            ? "bg-cyan-950/50 border-cyan-500/60 text-white shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/30"
                            : stop.isDestination
                            ? "bg-emerald-950/30 border-emerald-700/40 text-emerald-200 hover:bg-emerald-950/50"
                            : "bg-[#131926] border-slate-800/80 text-slate-300 hover:bg-[#182030]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${
                              stop.isDestination
                                ? "bg-emerald-500 text-black"
                                : stop.isOrigin
                                ? "bg-cyan-500 text-black"
                                : isCurrent
                                ? "bg-cyan-400 text-black"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}
                          >
                            {idx + 1}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">
                              {stop.name}
                              {stop.isOrigin && (
                                <span className="ml-1.5 text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  ORIGIN
                                </span>
                              )}
                              {stop.isDestination && (
                                <span className="ml-1.5 text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  DESTINATION
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Approx. {stop.time}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border font-semibold ${
                              stop.isDestination
                                ? "bg-emerald-900/60 text-emerald-300 border-emerald-700/50"
                                : "bg-slate-900 text-cyan-300 border-slate-800"
                            }`}
                          >
                            {stop.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Transport Helpdesk Footer */}
                <div className="p-3 bg-[#0A0E18] border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-cyan-400" />
                      Transport Helpline:
                    </span>
                    <a
                      href="tel:+914424503150"
                      className="text-cyan-400 font-mono hover:underline font-semibold"
                    >
                      044 - 2450 3150 / 3151
                    </a>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Students & Staff are strictly required to board 5 minutes prior to scheduled departure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
