import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  ExternalLink,
  X,
  Layers,
  Compass,
  Footprints,
  Copy,
  Check,
  Building2,
  Maximize2,
  Minimize2,
} from "lucide-react";

export interface CampusBlock {
  id: string;
  name: string;
  code: string;
  category: "Academic" | "Administrative" | "Facility" | "Hostel";
  coords: { lat: number; lng: number };
  walkTime: string;
  distance: string;
  description: string;
}

export const SATHYABAMA_BLOCKS: CampusBlock[] = [
  {
    id: "block-m",
    name: "Block M (Computer Science Complex)",
    code: "Block M",
    category: "Academic",
    coords: { lat: 12.8735, lng: 80.2212 },
    walkTime: "4 min",
    distance: "280 m",
    description: "4-story modern glass academic facility housing Computer Science, AI Labs & Exam Halls (Rooms 301-315).",
  },
  {
    id: "library",
    name: "Central Library & Digital Knowledge Centre",
    code: "Library Tower",
    category: "Academic",
    coords: { lat: 12.8738, lng: 80.2205 },
    walkTime: "3 min",
    distance: "210 m",
    description: "Multi-floor central library with digital research archive, study halls, and thesis repositories.",
  },
  {
    id: "admin",
    name: "Administrative Wing & Chancellor's Office",
    code: "Admin Block",
    category: "Administrative",
    coords: { lat: 12.8728, lng: 80.2201 },
    walkTime: "2 min",
    distance: "150 m",
    description: "Dean, Registrar, Admissions, On-Duty (OD) verification and Student Affairs desks.",
  },
  {
    id: "auditorium",
    name: "Dr. Remibai Jeppiaar Central Auditorium",
    code: "Auditorium",
    category: "Facility",
    coords: { lat: 12.8722, lng: 80.2215 },
    walkTime: "5 min",
    distance: "340 m",
    description: "Central air-conditioned auditorium for national symposiums, hackathons, and convocation ceremonies.",
  },
  {
    id: "main-gate",
    name: "Campus Main Gate & Transport Terminal",
    code: "Main Gate",
    category: "Facility",
    coords: { lat: 12.8719, lng: 80.2198 },
    walkTime: "0 min",
    distance: "0 m",
    description: "Main campus entrance on Rajiv Gandhi Salai (OMR) & central university bus boarding depot.",
  },
];

interface GoogleCampusMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBlock?: string;
  room?: string;
  steps?: string[];
}

export function GoogleCampusMapModal({
  isOpen,
  onClose,
  initialBlock = "Block M",
  room = "Room 302",
  steps = [],
}: GoogleCampusMapModalProps) {
  const [selectedBlock, setSelectedBlock] = useState<CampusBlock>(() => {
    return (
      SATHYABAMA_BLOCKS.find((b) => b.code.toLowerCase() === initialBlock.toLowerCase()) ||
      SATHYABAMA_BLOCKS[0]
    );
  });
  const [mapType, setMapType] = useState<"standard" | "satellite" | "schematic">("standard");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Sathyabama Institute coordinates
  const lat = selectedBlock.coords.lat;
  const lng = selectedBlock.coords.lng;
  const labelQuery = encodeURIComponent(`Sathyabama Institute of Science and Technology - ${selectedBlock.name}`);

  // Google Maps Embed URL (free, fast, no API key needed)
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}+(${labelQuery})&t=${
    mapType === "satellite" ? "k" : "m"
  }&z=18&ie=UTF8&iwloc=B&output=embed`;

  // External live Google Maps directions link
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=Sathyabama+Institute+of+Science+and+Technology&travelmode=walking`;

  function handleCopy() {
    navigator.clipboard.writeText(
      `${selectedBlock.name}, Sathyabama Institute of Science and Technology (Coordinates: ${lat}, ${lng})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 animate-in fade-in duration-200">
      <div
        className={`relative w-full bg-[var(--bg-surface)] border border-hairline-strong rounded-lg overflow-hidden flex flex-col transition-all duration-300 ${
          isFullscreen ? "h-[96vh] max-w-[96vw]" : "h-[85vh] max-w-5xl"
        }`}
      >
        {/* Top Google Maps Floating Search Bar Header */}
        <div className="p-3 sm:p-4 bg-[var(--bg-surface-2)] border-b border-hairline flex items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Google Maps Pin Icon Badge */}
            <div className="w-9 h-9 rounded-md bg-[var(--bg-base)] border border-hairline flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#B5675C]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-mono font-semibold text-sm sm:text-base text-[var(--text-primary)] truncate uppercase">
                  {selectedBlock.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-base)] text-[var(--text-secondary)] border border-hairline font-medium">
                  {selectedBlock.code} • {room}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] truncate">
                Sathyabama Institute of Science and Technology • Rajiv Gandhi Salai, Chennai 600119
              </p>
            </div>
          </div>

          {/* Controls: Mode toggle, Fullscreen, Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Map Type Switcher */}
            <div className="flex items-center bg-[#151B26] border border-[#2B3654] rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setMapType("standard")}
                className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                  mapType === "standard"
                    ? "bg-[#1A73E8] text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => setMapType("satellite")}
                className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                  mapType === "satellite"
                    ? "bg-[#1A73E8] text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Satellite
              </button>
              <button
                type="button"
                onClick={() => setMapType("schematic")}
                className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                  mapType === "schematic"
                    ? "bg-[#1A73E8] text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Schematic
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-[#151B26] text-slate-400 hover:text-white border border-[#2B3654] transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#151B26] text-slate-400 hover:text-white border border-[#2B3654] transition-colors"
              title="Close Map"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Campus Block Selection Chips */}
        <div className="px-4 py-2 bg-[#0A0D16] border-b border-[#1A2234] flex items-center gap-2 overflow-x-auto no-scrollbar select-none">
          <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-400" />
            Select Block:
          </span>
          {SATHYABAMA_BLOCKS.map((block) => {
            const isSelected = selectedBlock.id === block.id;
            return (
              <button
                key={block.id}
                type="button"
                onClick={() => setSelectedBlock(block)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/30 border border-indigo-400/40"
                    : "bg-[#141A29] text-slate-400 hover:text-slate-200 border border-[#232E4A]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? "bg-white" : "bg-[#1A73E8]"
                  }`}
                />
                <span>{block.code}</span>
              </button>
            );
          })}
        </div>

        {/* Map Body Canvas */}
        <div className="flex-1 relative bg-[#06080E] overflow-hidden flex flex-col md:flex-row">
          {/* Main Map Viewer */}
          <div className="flex-1 h-full relative">
            {mapType === "schematic" ? (
              // Custom High-Res Vector Campus Schematic
              <div className="w-full h-full p-6 flex flex-col items-center justify-center bg-[var(--bg-base)] text-[var(--text-secondary)] select-none overflow-y-auto">
                <div className="w-full max-w-2xl bg-[var(--bg-surface)] border-hairline rounded-md p-6 relative space-y-6">
                  <div className="flex items-center justify-between border-b border-hairline pb-3">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[var(--text-bright)]" />
                      <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[var(--text-bright)]">
                        Sathyabama Campus Architectural Layout
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-[#7A8C7A] bg-[#7A8C7A]/10 px-2 py-0.5 rounded-full border border-[#7A8C7A]/30">
                      LIVE WALKING ROUTE
                    </span>
                  </div>

                  {/* Campus Layout Diagram */}
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="p-4 rounded border-hairline bg-[var(--bg-base)] space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block">WEST WING</span>
                      <strong className="text-[var(--text-bright)] block">Admin Block</strong>
                      <span className="text-[11px] text-[var(--text-secondary)]">Admissions & OD Desk</span>
                    </div>

                    <div className="p-4 rounded border-hairline bg-[var(--bg-base)] space-y-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block">CENTRAL</span>
                      <strong className="text-[var(--text-bright)] block">Library Tower</strong>
                      <span className="text-[11px] text-[var(--text-secondary)]">Digital Archive</span>
                    </div>

                    <div
                      className={`p-4 rounded border transition-all space-y-1 relative ${
                        selectedBlock.id === "block-m"
                          ? "bg-[var(--bg-base)] border-[var(--text-bright)] ring-1 ring-[var(--text-bright)]/40"
                          : "bg-[var(--bg-base)] border-hairline"
                      }`}
                    >
                      <span className="text-[10px] font-mono text-[var(--text-bright)] font-bold block">EAST WING ★</span>
                      <strong className="text-[var(--text-bright)] block font-bold">Block M (CSE)</strong>
                      <span className="text-[11px] text-[var(--text-secondary)]">Room 302 • Exam Hall</span>
                    </div>

                    <div className="p-3 rounded border-hairline bg-[var(--bg-base)] space-y-1">
                      <strong className="text-[var(--text-bright)] block">Hostel Quads</strong>
                    </div>

                    <div className="p-3 rounded border border-dashed border-hairline bg-[var(--bg-base)] text-[var(--text-muted)] flex items-center justify-center font-mono text-[11px]">
                      ← Central Lawn Pathway (280m) →
                    </div>

                    <div className="p-3 rounded border-hairline bg-[var(--bg-base)] space-y-1">
                      <strong className="text-[var(--text-bright)] block">Remibai Auditorium</strong>
                    </div>
                  </div>

                  {/* Main Gate Bottom */}
                  <div className="p-3 rounded border-hairline bg-[var(--bg-base)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[var(--text-bright)]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-bright)]" />
                      <span>Start: <strong>Main Gate & Bus Terminal</strong></span>
                    </div>
                    <span className="text-[#7A8C7A] font-mono text-[11px] font-semibold">
                      🚶 4 min walk to Block M
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // Live Interactive Google Maps Embed
              <iframe
                title="Sathyabama Campus Navigation"
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full bg-[#0E121E]"
              />
            )}
          </div>

          {/* Turn-by-Turn Walking Directions Sidebar / Bottom Sheet */}
          <div className="w-full md:w-80 bg-[#0E121E]/95 border-t md:border-t-0 md:border-l border-[#1F293D] p-4 flex flex-col justify-between overflow-y-auto max-h-60 md:max-h-none z-10 backdrop-blur-xl">
            <div className="space-y-4">
              {/* Route Summary Card */}
              <div className="p-3.5 rounded-xl bg-[#141A28] border border-[#232E4A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Walking Estimate
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5" />
                    {selectedBlock.walkTime} ({selectedBlock.distance})
                  </span>
                </div>
                <div className="text-xs text-slate-200">
                  <span>Destination: </span>
                  <strong className="text-white">{selectedBlock.code}</strong>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {selectedBlock.description}
                  </p>
                </div>
              </div>

              {/* Step-by-Step Directions */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Navigation className="w-3 h-3 text-[#1A73E8]" />
                  <span>Turn-by-Turn Route:</span>
                </h5>
                <div className="space-y-2">
                  {(steps.length > 0
                    ? steps
                    : [
                        "Enter via Campus Main Gate & Bus Terminal on Rajiv Gandhi Salai.",
                        "Head straight past the North Entrance Plaza towards Central Lawn (approx. 60m).",
                        "Turn left at the Clock Tower towards the Central Library Tower (120m).",
                        "Block M is located immediately adjacent to the Library Tower.",
                        "Take Elevator B to the 3rd floor; Room 302 is located in the East corridor.",
                      ]
                  ).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-[#1A73E8]/20 text-[#60A5FA] border border-[#1A73E8]/40 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-[11px] leading-relaxed text-slate-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Google Maps Actions */}
            <div className="pt-4 border-t border-[#1F293D] mt-4 space-y-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] active:bg-[#1A73E8] text-white text-xs font-semibold shadow-lg shadow-[#1A73E8]/25 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Google Maps App</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-2 px-3 rounded-xl bg-[#141A28] hover:bg-[#1E2638] text-slate-300 hover:text-white border border-[#232E4A] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Coordinates Copied!" : "Copy Campus Location"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
