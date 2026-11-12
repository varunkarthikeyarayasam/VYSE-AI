import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Compass,
  ExternalLink,
  Footprints,
  Maximize2,
} from "lucide-react";
import { GoogleCampusMapModal } from "./GoogleCampusMapModal";

export interface NavigationCardData {
  destination: string;
  room: string;
  sessionTime?: string;
  startingPoint: string;
  steps: string[];
  lat?: number;
  lng?: number;
}

export function NavigationCard({ data }: { data: NavigationCardData }) {
  const [showDiagram, setShowDiagram] = useState(false);
  const [showGoogleMapModal, setShowGoogleMapModal] = useState(false);

  // Sathyabama coordinates
  const lat = data.lat ?? 12.8735;
  const lng = data.lng ?? 80.2212;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=Sathyabama+Institute+of+Science+and+Technology&travelmode=walking`;

  // Free high-performance Google Maps mini-preview embed
  const previewEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}+(Sathyabama+Campus+-+Block+M)&t=m&z=17&ie=UTF8&iwloc=B&output=embed`;

  return (
    <div className="rounded-lg border border-hairline bg-[var(--bg-surface)] p-4 sm:p-5 space-y-4 max-w-xl text-[var(--text-primary)] my-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-hairline">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--bg-surface-2)] border border-hairline flex items-center justify-center">
            <Navigation className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          </div>
          <h4 className="font-mono font-semibold text-[11px] tracking-[0.14em] text-[var(--text-tertiary)] uppercase">
            CAMPUS BLOCK NAVIGATION
          </h4>
        </div>
        <span className="text-[10px] font-mono tracking-wider text-[var(--text-secondary)] bg-[var(--bg-surface-2)] border border-hairline px-2 py-0.5 rounded font-medium">
          BLOCK M RESOLVED
        </span>
      </div>

      {/* Target Building Info */}
      <div className="bg-[var(--bg-surface-2)] p-4 rounded-md border border-hairline space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">Target Facility</span>
            <span className="font-semibold text-base text-[var(--text-primary)] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#B5675C]" />
              {data.destination} — {data.room}
            </span>
          </div>
          {data.sessionTime && (
            <div className="text-right">
              <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider block">Scheduled Time</span>
              <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">{data.sessionTime}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-hairline text-[var(--text-secondary)]">
          <span>Starting from: <strong className="text-[var(--text-primary)] font-medium">{data.startingPoint}</strong></span>
          <span className="text-[#7A8C7A] font-mono font-medium flex items-center gap-1">
            <Footprints className="w-3 h-3" />
            ~4 min walk (280m)
          </span>
        </div>
      </div>

      {/* Embedded Google Maps Live Mini-Preview */}
      <div className="rounded-md overflow-hidden border border-hairline bg-[var(--bg-base)] relative group">
        <div className="h-48 w-full relative">
          <iframe
            title="Google Maps Campus Preview"
            src={previewEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
          />

          {/* Click to Expand Overlay Button */}
          <button
            type="button"
            onClick={() => setShowGoogleMapModal(true)}
            className="absolute top-2 right-2 px-2.5 py-1.5 rounded-md bg-[var(--bg-surface-2)]/90 hover:border-hairline-strong border border-hairline text-[var(--text-primary)] text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>
        </div>

        {/* Location Tag below map */}
        <div className="p-2.5 bg-[var(--bg-surface-2)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span className="text-[11px] truncate flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B5675C]" />
            Sathyabama Institute • Block M (12.8735° N, 80.2212° E)
          </span>
          <button
            type="button"
            onClick={() => setShowGoogleMapModal(true)}
            className="text-[11px] font-mono font-medium text-[var(--text-primary)] hover:underline cursor-pointer ml-2 shrink-0"
          >
            Expand View →
          </button>
        </div>
      </div>

      {/* Step-by-step walking path */}
      <div className="space-y-2 bg-[var(--bg-base)] p-3.5 rounded-md border border-hairline text-xs">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block mb-1">
          Turn-by-Turn Walking Directions:
        </span>
        <div className="space-y-2">
          {data.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-[var(--text-secondary)]">
              <span className="w-4 h-4 rounded-full bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-hairline flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 font-bold">
                {idx + 1}
              </span>
              <span className="text-[11px] leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Schematic preview if toggled */}
      {showDiagram && (
        <div className="p-3 bg-[var(--bg-surface-2)] rounded-md border border-hairline space-y-2 text-center animate-in fade-in duration-150">
          <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider block">
            Campus Wing Schematic
          </span>
          <div className="h-28 rounded-md bg-[var(--bg-base)] border border-hairline flex items-center justify-center p-3">
            <div className="grid grid-cols-3 gap-2 w-full max-w-xs text-[10px] font-mono">
              <div className="p-2 rounded bg-[var(--bg-surface-2)] border border-hairline text-[var(--text-tertiary)]">Admin Wing</div>
              <div className="p-2 rounded bg-[var(--bg-surface)] border border-hairline-strong text-[var(--text-primary)] font-bold">
                Block M ★
              </div>
              <div className="p-2 rounded bg-[var(--bg-surface-2)] border border-hairline text-[var(--text-tertiary)]">Library Tower</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {/* Main Google Maps Modal Trigger */}
        <button
          type="button"
          onClick={() => setShowGoogleMapModal(true)}
          className="cta-pill-solid w-full py-2 px-3 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Open Google Maps</span>
        </button>

        {/* External Google Maps App Link */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-md bg-[var(--bg-surface-2)] hover:border-hairline-strong border border-hairline text-[var(--text-primary)] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <span>Open in Google Maps App</span>
        </a>
      </div>

      {/* Secondary Schematic Toggle */}
      <button
        type="button"
        onClick={() => setShowDiagram(!showDiagram)}
        className="w-full py-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-[11px] font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer"
      >
        <Compass className="w-3 h-3" />
        <span>{showDiagram ? "Hide Blueprint Schematic" : "Show Blueprint Schematic"}</span>
      </button>

      {/* Fullscreen Interactive Google Maps Modal */}
      <GoogleCampusMapModal
        isOpen={showGoogleMapModal}
        onClose={() => setShowGoogleMapModal(false)}
        initialBlock="Block M"
        room={data.room}
        steps={data.steps}
      />
    </div>
  );
}