import React, { useState } from "react";
import { Bus, ArrowRight, CheckCircle2, Clock, MapPin, ChevronDown, ChevronUp } from "lucide-react";

export interface BusRouteStop {
  order: number;
  name: string;
  time: string;
}

export interface TransportCardData {
  routeName: string;
  origin: string;
  destination: string;
  recommendedStop: string;
  departureTime: string;
  arrivalTime: string;
  reasons: string[];
  stops: BusRouteStop[];
  isTemporary?: boolean;
}

export function TransportCard({ data }: { data: TransportCardData }) {
  const [showStops, setShowStops] = useState(false);

  return (
    <div className="rounded-lg border border-hairline bg-[var(--bg-surface)] p-5 space-y-4 max-w-xl text-[var(--text-primary)] my-2">
      <div className="flex items-center justify-between pb-3 border-b border-hairline">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--bg-surface-2)] border border-hairline flex items-center justify-center text-[var(--text-secondary)]">
            <Bus className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-mono font-semibold text-[11px] tracking-[0.14em] text-[var(--text-tertiary)] uppercase">
              BEST TRANSIT MATCH
            </h4>
            <span className="text-[10px] text-[var(--text-secondary)] font-mono">
              College Transport Matrix
            </span>
          </div>
        </div>
        {data.isTemporary && (
          <span className="text-[10px] font-mono tracking-wider text-[#C29B38] bg-[var(--bg-surface-2)] border border-[#C29B38]/30 px-2 py-0.5 rounded">
            SPECIAL SCHEDULE
          </span>
        )}
      </div>

      <div className="bg-[var(--bg-surface-2)] p-4 rounded-md border border-hairline space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">Route</span>
            <div className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
              <span>{data.origin}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              <span>{data.destination}</span>
            </div>
            <span className="text-[11px] text-[var(--text-secondary)] font-medium block">
              {data.routeName}
            </span>
          </div>

          <div className="text-right bg-[var(--bg-base)] px-3 py-2 rounded-md border border-hairline">
            <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider block">Boarding</span>
            <span className="font-mono font-semibold text-[var(--text-primary)] text-sm">
              {data.departureTime}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-hairline text-xs">
          <div>
            <span className="text-[10px] text-[var(--text-tertiary)] block">Recommended Stop</span>
            <span className="text-[var(--text-primary)] font-medium">{data.recommendedStop}</span>
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-tertiary)] block">Campus Arrival</span>
            <span className="font-mono text-[var(--text-primary)] font-semibold">{data.arrivalTime}</span>
          </div>
        </div>
      </div>

      {/* Why this route */}
      <div className="space-y-1.5 bg-[var(--bg-base)] p-3 rounded-md border border-hairline text-xs">
        <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider block mb-1">
          Why This Route:
        </span>
        {data.reasons.map((reason, idx) => (
          <div key={idx} className="flex items-center gap-2 text-[var(--text-secondary)]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7A8C7A] shrink-0" />
            <span className="text-[11px]">{reason}</span>
          </div>
        ))}
      </div>

      {/* Toggle Stop Timeline */}
      {showStops && data.stops && data.stops.length > 0 && (
        <div className="p-3 bg-[var(--bg-surface-2)] rounded-md border border-hairline space-y-2 text-xs">
          <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider block">
            Scheduled Stops Sequence
          </span>
          <div className="space-y-1.5 border-l border-hairline-strong pl-3 my-1">
            {data.stops.map((s) => (
              <div key={s.order} className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-secondary)]">{s.name}</span>
                <span className="font-mono text-[var(--text-primary)]">{s.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            const cleanRouteNo = data.routeName.replace(/Route\s*/i, "").split("•")[0].trim();
            window.dispatchEvent(
              new CustomEvent("open-bus-transit", { detail: { routeNo: cleanRouteNo } })
            );
          }}
          className="cta-pill-solid flex-1 py-2 px-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Bus className="w-3.5 h-3.5" />
          <span>Open Satellite Map</span>
        </button>

        <button
          type="button"
          onClick={() => setShowStops(!showStops)}
          className="py-2 px-3 rounded-md bg-[var(--bg-surface-2)] hover:border-hairline-strong border border-hairline text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{showStops ? "Hide Stops" : "View Stops"}</span>
          {showStops ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}