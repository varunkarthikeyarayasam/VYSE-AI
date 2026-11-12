import { supabase } from "../supabase";
import type { BusRoute, RouteChange } from "../../types/database";
import {
  SATHYABAMA_BUS_ROUTES,
  SathyabamaBusRoute,
  SATHYABAMA_CAMPUS_LOCATION,
} from "../../data/sathyabamaBusRoutes";

export { SATHYABAMA_BUS_ROUTES, SATHYABAMA_CAMPUS_LOCATION };
export type { SathyabamaBusRoute };

/**
 * Searches Sathyabama's 175 official bus routes by route number, origin, via stops, driver name, or vehicle number.
 */
export function searchSathyabamaBusRoutes(query: string, zoneFilter?: string): SathyabamaBusRoute[] {
  const q = query.trim().toLowerCase();
  return SATHYABAMA_BUS_ROUTES.filter((route) => {
    if (zoneFilter && zoneFilter !== "All Zones" && route.zone !== zoneFilter) {
      return false;
    }
    if (!q) return true;

    return (
      route.routeNo.toLowerCase().includes(q) ||
      route.origin.toLowerCase().includes(q) ||
      route.driverName.toLowerCase().includes(q) ||
      route.vehicleNo.toLowerCase().includes(q) ||
      route.viaStops.some((s) => s.toLowerCase().includes(q)) ||
      route.stops.some((s) => s.name.toLowerCase().includes(q))
    );
  });
}

/**
 * Returns a specific bus route by its route number (e.g. "1A", "37B", "17") or serial number.
 */
export function getSathyabamaBusRoute(routeNoOrSlNo: string | number): SathyabamaBusRoute | undefined {
  const needle = String(routeNoOrSlNo).trim().toLowerCase();
  return SATHYABAMA_BUS_ROUTES.find(
    (r) => String(r.slNo) === needle || r.routeNo.toLowerCase() === needle
  );
}

/**
 * Returns bus routes passing through a specific stop/neighborhood.
 */
export function getRoutesByStop(stopName: string): SathyabamaBusRoute[] {
  const needle = stopName.trim().toLowerCase();
  return SATHYABAMA_BUS_ROUTES.filter(
    (r) =>
      r.origin.toLowerCase().includes(needle) ||
      r.viaStops.some((s) => s.toLowerCase().includes(needle))
  );
}

export async function getActiveBusRoute(origin: string = "Tambaram"): Promise<BusRoute | null> {
  const { data, error } = await supabase.rpc("get_active_bus_route", {
    p_origin: origin,
    p_destination: "Campus",
  });
  if (error) throw error;
  return data as BusRoute | null;
}

export async function getAllBusRoutes(): Promise<BusRoute[]> {
  const { data, error } = await supabase
    .from("bus_routes")
    .select(`
      id, route_name, origin, destination, active, is_temporary, valid_from, valid_until, created_at,
      bus_stops (id, stop_name, stop_order, arrival_time, latitude, longitude)
    `)
    .eq("active", true)
    .order("is_temporary", { ascending: false });

  if (error) throw error;

  return (data || []).map((r: any) => ({
    ...r,
    stops: (r.bus_stops || []).sort((a: any, b: any) => a.stop_order - b.stop_order),
  })) as BusRoute[];
}

export async function getRouteChanges(): Promise<RouteChange[]> {
  const { data, error } = await supabase
    .from("route_changes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as RouteChange[];
}