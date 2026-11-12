import React, { useState, useEffect } from "react";
import { MapPin, Clock, Calendar, Search, Building2 } from "lucide-react";
import { Card, Badge } from "../../ui";
import { getCampusLocations, getAcademicCalendar } from "../../../lib/api/campus";
import type { CampusLocation, AcademicCalendarItem } from "../../../types/database";

export function CampusView() {
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [calendar, setCalendar] = useState<AcademicCalendarItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [locs, cal] = await Promise.all([
        getCampusLocations(),
        getAcademicCalendar(),
      ]);
      setLocations(locs);
      setCalendar(cal);
    } catch (err) {
      console.error("Error loading campus data:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredLocations = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.building.toLowerCase().includes(search.toLowerCase()) ||
      l.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Campus Facilities & Operations</h2>
          <p className="text-xs text-slate-400">
            Interactive facility directory with live operational hours and calendar schedules
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venue or lab..."
            className="w-full bg-[#11141E] border border-[#252E46] text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Campus Locations & Hours
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLocations.map((loc) => (
            <Card key={loc.id} className="space-y-2 hover:border-[#354060] transition-colors">
              <div className="flex items-center justify-between">
                <Badge variant="glow">{loc.type.toUpperCase()}</Badge>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {loc.open_time?.slice(0, 5) || "08:00"} - {loc.close_time?.slice(0, 5) || "20:00"}
                </span>
              </div>
              <h4 className="font-semibold text-slate-100 text-sm">{loc.name}</h4>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                {loc.building} {loc.floor ? `(${loc.floor})` : ""}
              </p>
              {loc.description && (
                <p className="text-xs text-slate-500 pt-1 border-t border-[#212738]">
                  {loc.description}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Academic Calendar Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Upcoming Academic Calendar & Deadlines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {calendar.map((item) => (
            <Card key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    item.category === "holiday"
                      ? "success"
                      : item.category === "exam"
                      ? "danger"
                      : item.category === "event"
                      ? "info"
                      : "warning"
                  }
                  size="sm"
                >
                  {item.category.toUpperCase()}
                </Badge>
                <span className="text-xs font-mono text-slate-400">📅 {item.event_date}</span>
              </div>
              <h4 className="font-semibold text-slate-200 text-sm">{item.title}</h4>
              {item.description && (
                <p className="text-xs text-slate-400">{item.description}</p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}