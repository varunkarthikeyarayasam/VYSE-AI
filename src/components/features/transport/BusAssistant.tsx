import React, { useState, useEffect } from "react";
import { Bus, Clock, MapPin, AlertCircle, Sparkles, Navigation, ArrowRight } from "lucide-react";
import { Card, Badge, Button } from "../../ui";
import { getActiveBusRoute, getAllBusRoutes, getRouteChanges } from "../../../lib/api/transport";
import { useAuth } from "../../../store/authContext";
import type { BusRoute, RouteChange } from "../../../types/database";

export function BusAssistant() {
  const { student } = useAuth();
  const [selectedOrigin, setSelectedOrigin] = useState("Tambaram");
  const [activeRoute, setActiveRoute] = useState<BusRoute | null>(null);
  const [allRoutes, setAllRoutes] = useState<BusRoute[]>([]);
  const [routeChanges, setRouteChanges] = useState<RouteChange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student?.home_location) {
      if (student.home_location.toLowerCase().includes("tambaram")) setSelectedOrigin("Tambaram");
      else if (student.home_location.toLowerCase().includes("chromepet")) setSelectedOrigin("Chromepet");
      else if (student.home_location.toLowerCase().includes("velachery")) setSelectedOrigin("Velachery");
    }
    loadData();
  }, [selectedOrigin, student]);

  async function loadData() {
    setLoading(true);
    try {
      const [route, routes, changes] = await Promise.all([
        getActiveBusRoute(selectedOrigin),
        getAllBusRoutes(),
        getRouteChanges(),
      ]);
      setActiveRoute(route);
      setAllRoutes(routes);
      setRouteChanges(changes);
    } catch (err) {
      console.error("Error loading bus transit data:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Smart Campus Bus Assistant</h2>
          <p className="text-xs text-slate-400">
            Real-time route scheduling with automated event-day special services
          </p>
        </div>

        {/* Origin Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Boarding Origin:</span>
          <select
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            className="bg-[#11141E] text-slate-200 border border-[#252E46] text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
          >
            <option value="Tambaram">Tambaram</option>
            <option value="Chromepet">Chromepet</option>
            <option value="Velachery">Velachery</option>
          </select>
        </div>
      </div>

      {/* Primary Recommended Route Card */}
      {loading ? (
        <Card className="text-center py-10 text-slate-400 text-sm">
          Optimizing transport route for {selectedOrigin}...
        </Card>
      ) : activeRoute ? (
        <Card className="border-indigo-500/30 bg-gradient-to-b from-[#131828] to-[#101420] shadow-xl relative overflow-hidden">
          {activeRoute.is_temporary && (
            <div className="bg-gradient-to-r from-amber-500 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> SPECIAL EVENT-DAY SERVICE ACTIVE
              </span>
              <span className="text-[11px] opacity-90">Priority Dispatch</span>
            </div>
          )}

          <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-100">{activeRoute.route_name}</h3>
                  <Badge variant={activeRoute.is_temporary ? "warning" : "info"}>
                    {activeRoute.is_temporary ? "Special Schedule" : "Regular Service"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                  <span>{activeRoute.origin}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span>{activeRoute.destination}</span>
                </p>
              </div>

              {activeRoute.stops && activeRoute.stops.length > 0 && (
                <div className="bg-[#090B10]/80 px-3.5 py-2 rounded-xl border border-[#212738] text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Boarding Time</span>
                  <span className="text-base font-bold text-indigo-400 font-mono">
                    {activeRoute.stops[0].arrival_time}
                  </span>
                </div>
              )}
            </div>

            {/* Stop-by-Stop Timeline */}
            <div className="pt-3 border-t border-[#212738]">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Scheduled Stops & Estimated Arrivals
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeRoute.stops?.map((stop, idx) => (
                  <div
                    key={stop.stop_order}
                    className="p-3 rounded-xl bg-[#090B10]/60 border border-[#212738] relative"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-slate-400">
                        Stop #{stop.stop_order}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        {stop.arrival_time}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-200">{stop.stop_name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-10 text-slate-400 text-sm">
          No active routes currently serving {selectedOrigin}.
        </Card>
      )}

      {/* All Routes Directory */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          All Active University Bus Routes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allRoutes.map((route) => (
            <Card key={route.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-200 text-sm">{route.route_name}</h4>
                <Badge variant={route.is_temporary ? "warning" : "neutral"} size="sm">
                  {route.is_temporary ? "Temporary" : "Daily Regular"}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                {route.origin} → {route.destination}
              </p>
              {route.stops && (
                <p className="text-[11px] text-slate-500">
                  {route.stops.length} stops • Departs: {route.stops[0]?.arrival_time || "—"}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}