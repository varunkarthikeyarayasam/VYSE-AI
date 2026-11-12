import React, { createContext, useContext, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

// ==========================================
// PIE CHART
// ==========================================

export interface PieDataItem {
  label: string;
  value: number;
  color?: string;
}

interface PieArc {
  item: PieDataItem;
  index: number;
  startAngle: number;
  endAngle: number;
  path: string;
  percentage: number;
}

interface PieContextType {
  data: PieDataItem[];
  arcs: PieArc[];
  size: number;
  center: number;
  radius: number;
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
}

const PieContext = createContext<PieContextType | null>(null);

const DEFAULT_COLORS = ["#0ea5e9", "#a855f7", "#f59e0b", "#10b981", "#ec4899", "#6366f1"];

export function PieChart({
  data,
  size = 260,
  className,
  children,
}: {
  data: PieDataItem[];
  size?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const center = size / 2;
  const radius = center - 20;

  const total = useMemo(() => data.reduce((sum, item) => sum + (item.value || 0), 0), [data]);

  const arcs = useMemo<PieArc[]>(() => {
    let currentAngle = -Math.PI / 2; // start from top (12 o'clock)
    return data.map((item, index) => {
      const sliceAngle = total > 0 ? (item.value / total) * 2 * Math.PI : 0;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);
      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      // Draw slice as pie wedge (M center L x1 y1 A r r 0 largeArc 1 x2 y2 Z)
      const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;

      return { item, index, startAngle, endAngle, path, percentage };
    });
  }, [data, total, center, radius]);

  const hoveredArc = hoveredIndex !== null ? arcs[hoveredIndex] : null;

  return (
    <PieContext.Provider value={{ data, arcs, size, center, radius, hoveredIndex, setHoveredIndex }}>
      <div className={cn("relative flex flex-col items-center", className)}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          <g>{children}</g>
        </svg>

        {/* Hover info / Tooltip */}
        {hoveredArc && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/60 text-xs shadow-lg backdrop-blur-md pointer-events-none flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: hoveredArc.item.color || DEFAULT_COLORS[hoveredArc.index % DEFAULT_COLORS.length] }}
            />
            <span className="font-medium text-slate-200">{hoveredArc.item.label}:</span>
            <span className="text-white font-mono">{hoveredArc.item.value.toLocaleString()} ({hoveredArc.percentage}%)</span>
          </div>
        )}

        {/* Chart Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs text-slate-400">
          {data.map((item, idx) => {
            const color = item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "flex items-center gap-1.5 cursor-pointer transition-opacity duration-150 select-none",
                  hoveredIndex !== null && !isHovered ? "opacity-40" : "opacity-100"
                )}
              >
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-slate-300 font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </PieContext.Provider>
  );
}

export function PieSlice({
  index,
  color,
  className,
}: {
  index: number;
  color?: string;
  className?: string;
}) {
  const context = useContext(PieContext);
  if (!context) return null;

  const { arcs, hoveredIndex, setHoveredIndex } = context;
  const arc = arcs[index];
  if (!arc) return null;

  const sliceColor = color || arc.item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  const isHovered = hoveredIndex === index;
  const isAnyHovered = hoveredIndex !== null;

  return (
    <path
      d={arc.path}
      fill={sliceColor}
      stroke="#0E121E"
      strokeWidth={2}
      className={cn("transition-all duration-200 cursor-pointer", className)}
      style={{
        opacity: isAnyHovered && !isHovered ? 0.45 : 1,
        transformOrigin: `${context.center}px ${context.center}px`,
        transform: isHovered ? "scale(1.04)" : "scale(1)",
        filter: isHovered ? `drop-shadow(0 0 10px ${sliceColor}80)` : "none",
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    />
  );
}


// ==========================================
// RADAR CHART
// ==========================================

export interface RadarMetric {
  key: string;
  label: string;
}

export interface RadarSeries {
  label: string;
  color: string;
  values: Record<string, number>;
}

interface RadarContextType {
  data: RadarSeries[];
  metrics: RadarMetric[];
  size: number;
  center: number;
  radius: number;
  angleStep: number;
  hoveredSeries: number | null;
  setHoveredSeries: (idx: number | null) => void;
}

const RadarContext = createContext<RadarContextType | null>(null);

export function RadarChart({
  data,
  metrics,
  size = 300,
  className,
  children,
}: {
  data: RadarSeries[];
  metrics: RadarMetric[];
  size?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [hoveredSeries, setHoveredSeries] = useState<number | null>(null);

  const center = size / 2;
  const radius = center - 45; // Leave space for labels
  const angleStep = metrics.length > 0 ? (2 * Math.PI) / metrics.length : 0;

  return (
    <RadarContext.Provider
      value={{ data, metrics, size, center, radius, angleStep, hoveredSeries, setHoveredSeries }}
    >
      <div className={cn("relative flex flex-col items-center", className)}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {children}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs">
          {data.map((series, idx) => {
            const isHovered = hoveredSeries === idx;
            return (
              <div
                key={series.label}
                onMouseEnter={() => setHoveredSeries(idx)}
                onMouseLeave={() => setHoveredSeries(null)}
                className={cn(
                  "flex items-center gap-1.5 cursor-pointer transition-opacity duration-150 select-none",
                  hoveredSeries !== null && !isHovered ? "opacity-30" : "opacity-100"
                )}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: series.color }} />
                <span className="text-slate-300 font-medium">{series.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </RadarContext.Provider>
  );
}

export function RadarGrid({ levels = 4 }: { levels?: number }) {
  const context = useContext(RadarContext);
  if (!context) return null;

  const { metrics, center, radius, angleStep } = context;

  const gridPolygons = useMemo(() => {
    return Array.from({ length: levels }, (_, levelIdx) => {
      const levelRadius = (radius / levels) * (levelIdx + 1);
      const points = metrics.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + levelRadius * Math.cos(angle);
        const y = center + levelRadius * Math.sin(angle);
        return `${x},${y}`;
      }).join(" ");
      return { levelRadius, points };
    });
  }, [levels, radius, metrics, angleStep, center]);

  return (
    <g className="radar-grid">
      {gridPolygons.map(({ points }, idx) => (
        <polygon
          key={idx}
          points={points}
          fill="none"
          stroke="#2B3654"
          strokeOpacity={0.4}
          strokeWidth={1}
        />
      ))}
    </g>
  );
}

export function RadarAxis() {
  const context = useContext(RadarContext);
  if (!context) return null;

  const { metrics, center, radius, angleStep } = context;

  return (
    <g className="radar-axes">
      {metrics.map((metric, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x2 = center + radius * Math.cos(angle);
        const y2 = center + radius * Math.sin(angle);
        return (
          <line
            key={metric.key}
            x1={center}
            y1={center}
            x2={x2}
            y2={y2}
            stroke="#2B3654"
            strokeOpacity={0.5}
            strokeWidth={1}
          />
        );
      })}
    </g>
  );
}

export function RadarLabels() {
  const context = useContext(RadarContext);
  if (!context) return null;

  const { metrics, center, radius, angleStep } = context;

  return (
    <g className="radar-labels select-none">
      {metrics.map((metric, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = radius + 18;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);

        // Adjust text anchoring based on angle
        let textAnchor: "middle" | "start" | "end" = "middle";
        if (Math.cos(angle) > 0.3) textAnchor = "start";
        else if (Math.cos(angle) < -0.3) textAnchor = "end";

        return (
          <text
            key={metric.key}
            x={x}
            y={y}
            textAnchor={textAnchor}
            dominantBaseline="central"
            className="text-[11px] font-medium fill-slate-400"
          >
            {metric.label}
          </text>
        );
      })}
    </g>
  );
}

export function RadarArea({
  index,
  color: colorProp,
  className,
}: {
  index: number;
  color?: string;
  className?: string;
}) {
  const context = useContext(RadarContext);
  if (!context) return null;

  const { data, metrics, center, radius, angleStep, hoveredSeries } = context;
  const series = data[index];
  if (!series) return null;

  const color = colorProp || series.color;
  const isHovered = hoveredSeries === index;
  const isAnyHovered = hoveredSeries !== null;

  const points = metrics.map((metric, i) => {
    const rawVal = series.values[metric.key] ?? 0;
    const normalized = Math.min(Math.max(rawVal / 100, 0), 1);
    const r = radius * normalized;
    const angle = i * angleStep - Math.PI / 2;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, str: `${x},${y}` };
  });

  const polygonPoints = points.map((p) => p.str).join(" ");

  return (
    <g
      className={cn("transition-opacity duration-200", className)}
      style={{ opacity: isAnyHovered && !isHovered ? 0.25 : 1 }}
    >
      <polygon
        points={polygonPoints}
        fill={color}
        fillOpacity={isHovered ? 0.35 : 0.2}
        stroke={color}
        strokeWidth={isHovered ? 2.5 : 1.5}
        className="transition-all duration-200"
        style={{
          filter: isHovered ? `drop-shadow(0 0 8px ${color}80)` : "none",
        }}
      />
      {points.map((p, pIdx) => (
        <circle
          key={pIdx}
          cx={p.x}
          cy={p.y}
          r={isHovered ? 4 : 3}
          fill={color}
          stroke="#0E121E"
          strokeWidth={1.5}
          className="transition-all duration-150"
        />
      ))}
    </g>
  );
}

// ==========================================
// CONTRIBUTION HEATMAP / HEAT WAVE CHART
// Monochrome Dark Aesthetic for VYSE
// ==========================================

export interface HeatmapDayBin {
  bin: number; // Day of week (0 to 6, 0=Sun or 0=Mon)
  count: number; // Activity count / hours logged
  date: Date;
  status?: string;
  label?: string;
  metadata?: {
    status?: "present" | "od" | "leave" | "holiday" | "weekend" | string;
    statusLabel?: string;
    title?: string;
    details?: string;
    rfidPunch?: string;
    hours?: number;
    [key: string]: any;
  };
}

export interface HeatmapWeekColumn {
  bin: number; // Week index (0, 1, 2, ...)
  bins: HeatmapDayBin[];
}

export type HeatmapData = HeatmapWeekColumn[];

interface HeatmapInteractionContextType {
  hoveredBin: HeatmapDayBin | null;
  hoveredWeekIndex: number | null;
  hoveredDayIndex: number | null;
  tooltipPos: { x: number; y: number } | null;
  setHoveredItem: (
    bin: HeatmapDayBin | null,
    weekIndex: number | null,
    dayIndex: number | null,
    pos: { x: number; y: number } | null
  ) => void;
  selectedBin: HeatmapDayBin | null;
  setSelectedBin: (bin: HeatmapDayBin | null) => void;
}

const HeatmapInteractionContext = createContext<HeatmapInteractionContextType>({
  hoveredBin: null,
  hoveredWeekIndex: null,
  hoveredDayIndex: null,
  tooltipPos: null,
  setHoveredItem: () => {},
  selectedBin: null,
  setSelectedBin: () => {},
});

export function HeatmapInteractionProvider({ children }: { children: React.ReactNode }) {
  const [hoveredBin, setHoveredBin] = useState<HeatmapDayBin | null>(null);
  const [hoveredWeekIndex, setHoveredWeekIndex] = useState<number | null>(null);
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedBin, setSelectedBin] = useState<HeatmapDayBin | null>(null);

  const setHoveredItem = (
    bin: HeatmapDayBin | null,
    weekIndex: number | null,
    dayIndex: number | null,
    pos: { x: number; y: number } | null
  ) => {
    setHoveredBin(bin);
    setHoveredWeekIndex(weekIndex);
    setHoveredDayIndex(dayIndex);
    setTooltipPos(pos);
  };

  return (
    <HeatmapInteractionContext.Provider
      value={{
        hoveredBin,
        hoveredWeekIndex,
        hoveredDayIndex,
        tooltipPos,
        setHoveredItem,
        selectedBin,
        setSelectedBin,
      }}
    >
      {children}
    </HeatmapInteractionContext.Provider>
  );
}

export function HeatmapInteractionBoundary({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { setHoveredItem } = useContext(HeatmapInteractionContext);

  return (
    <div
      onMouseLeave={() => setHoveredItem(null, null, null, null)}
      className={cn("relative group w-full select-none", className)}
    >
      {children}
    </div>
  );
}

interface HeatmapChartContextType {
  data: HeatmapWeekColumn[];
  layout: "fluid" | "fixed";
  cellSize: number;
  cellGap: number;
  onCellClick?: (bin: HeatmapDayBin) => void;
}

const HeatmapChartContext = createContext<HeatmapChartContextType | null>(null);

export function HeatmapChart({
  data,
  layout = "fluid",
  cellSize = 13,
  cellGap = 3,
  onCellClick,
  className,
  children,
}: {
  data: HeatmapWeekColumn[];
  layout?: "fluid" | "fixed";
  cellSize?: number;
  cellGap?: number;
  onCellClick?: (bin: HeatmapDayBin) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <HeatmapChartContext.Provider
      value={{
        data,
        layout,
        cellSize,
        cellGap,
        onCellClick,
      }}
    >
      <div
        className={cn(
          "w-full overflow-x-auto custom-scrollbar pb-2",
          layout === "fluid" ? "min-w-full" : "",
          className
        )}
      >
        <div className="flex flex-col gap-2 min-w-max p-1">{children}</div>
      </div>
    </HeatmapChartContext.Provider>
  );
}

// Monochrome color resolution for VYSE dark aesthetic
export function getMonochromeHeatmapColor(count: number, metadata?: HeatmapDayBin["metadata"]) {
  // If count is 0
  if (count <= 0) {
    return {
      bg: "bg-[#111622]",
      border: "border-[#1E2536]",
      hoverBorder: "hover:border-slate-500",
      text: "text-slate-500",
      level: 0,
      glow: "",
    };
  }
  // Light intensity (1-2)
  if (count <= 2) {
    return {
      bg: "bg-[#242F42]",
      border: "border-[#35435D]",
      hoverBorder: "hover:border-slate-300",
      text: "text-slate-300",
      level: 1,
      glow: "",
    };
  }
  // Medium intensity (3-4)
  if (count <= 4) {
    return {
      bg: "bg-[#475773]",
      border: "border-[#5E7192]",
      hoverBorder: "hover:border-slate-200",
      text: "text-slate-200",
      level: 2,
      glow: "",
    };
  }
  // High intensity (5-6)
  if (count <= 6) {
    return {
      bg: "bg-[#8E9EB7]",
      border: "border-[#B5C4DC]",
      hoverBorder: "hover:border-white",
      text: "text-slate-900",
      level: 3,
      glow: "shadow-[0_0_6px_rgba(203,213,225,0.3)]",
    };
  }
  // Peak intensity (7+) - Radiant platinum white
  return {
    bg: "bg-[#F8FAFC]",
    border: "border-white",
    hoverBorder: "hover:border-white",
    text: "text-slate-950",
    level: 4,
    glow: "shadow-[0_0_10px_rgba(255,255,255,0.6)]",
  };
}

export function HeatmapCells({
  className,
  onSelect,
}: {
  className?: string;
  onSelect?: (bin: HeatmapDayBin) => void;
}) {
  const chartContext = useContext(HeatmapChartContext);
  const interactionContext = useContext(HeatmapInteractionContext);

  if (!chartContext) return null;
  const { data, onCellClick } = chartContext;
  const { hoveredBin, setHoveredItem, selectedBin, setSelectedBin } = interactionContext;

  const handleMouseEnter = (
    dayBin: HeatmapDayBin,
    wIdx: number,
    dIdx: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parent = e.currentTarget.closest(".group")?.getBoundingClientRect();
    const relativeX = parent ? rect.left - parent.left + rect.width / 2 : rect.left;
    const relativeY = parent ? rect.top - parent.top : rect.top;

    setHoveredItem(dayBin, wIdx, dIdx, { x: relativeX, y: relativeY });
  };

  return (
    <div className={cn("flex items-center gap-[3px]", className)}>
      {data.map((week, wIdx) => {
        return (
          <div key={week.bin ?? wIdx} className="flex flex-col gap-[3px]">
            {week.bins.map((dayBin, dIdx) => {
              const colorInfo = getMonochromeHeatmapColor(dayBin.count, dayBin.metadata);
              const isHovered = hoveredBin?.date?.getTime() === dayBin.date?.getTime();
              const isSelected = selectedBin?.date?.getTime() === dayBin.date?.getTime();
              const isOd = dayBin.metadata?.status === "od";
              const isToday =
                dayBin.date.getFullYear() === 2026 &&
                dayBin.date.getMonth() === 8 && // September (0-indexed)
                dayBin.date.getDate() === 11;

              return (
                <button
                  key={dayBin.bin ?? dIdx}
                  type="button"
                  onMouseEnter={(e) => handleMouseEnter(dayBin, wIdx, dIdx, e)}
                  onClick={() => {
                    setSelectedBin(dayBin);
                    onSelect?.(dayBin);
                    onCellClick?.(dayBin);
                  }}
                  className={cn(
                    "w-3.5 h-3.5 rounded-[3px] border transition-all duration-150 cursor-pointer relative shrink-0",
                    colorInfo.bg,
                    colorInfo.border,
                    colorInfo.hoverBorder,
                    colorInfo.glow,
                    isHovered
                      ? "scale-125 z-20 ring-2 ring-white shadow-lg border-white"
                      : "hover:scale-110",
                    isSelected ? "ring-2 ring-indigo-400 border-white" : "",
                    isToday ? "ring-1 ring-cyan-400/80" : ""
                  )}
                  aria-label={`${dayBin.date.toDateString()}: ${dayBin.count} hours logged`}
                >
                  {/* Subtle pulsing indicator for OD days */}
                  {isOd && (
                    <span className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-white/90 animate-pulse pointer-events-none" />
                  )}
                  {/* Subtle ring for Today */}
                  {isToday && !isHovered && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 pointer-events-none ring-1 ring-black" />
                  )}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function HeatmapXAxis({
  className,
}: {
  className?: string;
}) {
  const chartContext = useContext(HeatmapChartContext);
  if (!chartContext) return null;
  const { data } = chartContext;

  // Compute month positions across the weeks
  const monthLabels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;

  data.forEach((week, wIdx) => {
    // Find the first valid date in this week
    const firstDate = week.bins[0]?.date || week.bins.find((b) => b.date)?.date;
    if (firstDate) {
      const month = firstDate.getMonth();
      if (month !== lastMonth) {
        lastMonth = month;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        monthLabels.push({
          label: monthNames[month],
          weekIndex: wIdx,
        });
      }
    }
  });

  return (
    <div className={cn("relative h-4 w-full flex text-[10px] font-mono text-slate-400 select-none", className)}>
      <div className="flex gap-[3px] w-full">
        {data.map((_, wIdx) => {
          const match = monthLabels.find((m) => m.weekIndex === wIdx);
          return (
            <div key={wIdx} className="w-3.5 shrink-0 relative">
              {match && (
                <span className="absolute left-0 top-0 font-bold text-slate-300 tracking-wider">
                  {match.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HeatmapYAxis({
  className,
  labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
}: {
  className?: string;
  labels?: string[];
}) {
  return (
    <div className={cn("flex flex-col justify-between h-[116px] pr-2 text-[10px] font-mono text-slate-500 select-none", className)}>
      {labels.map((day, idx) => {
        // Show alternating days (Mon, Wed, Fri) for uncluttered aesthetic
        const show = idx === 1 || idx === 3 || idx === 5;
        return (
          <span key={day} className={cn("h-3.5 leading-[14px]", show ? "opacity-100" : "opacity-0")}>
            {day}
          </span>
        );
      })}
    </div>
  );
}

export function HeatmapTooltip({
  className,
}: {
  className?: string;
}) {
  const { hoveredBin, tooltipPos } = useContext(HeatmapInteractionContext);

  if (!hoveredBin || !tooltipPos) return null;

  const dateStr = hoveredBin.date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const hours = hoveredBin.metadata?.hours ?? hoveredBin.count;
  const status = hoveredBin.metadata?.status || hoveredBin.status;
  const statusLabel = hoveredBin.metadata?.statusLabel || (status === "od" ? "On-Duty (OD)" : status === "leave" ? "Leave" : status === "holiday" ? "Holiday" : "Present");
  const details = hoveredBin.metadata?.details || hoveredBin.label;
  const rfid = hoveredBin.metadata?.rfidPunch;

  return (
    <div
      style={{
        left: `${tooltipPos.x}px`,
        top: `${Math.max(10, tooltipPos.y - 74)}px`,
        transform: "translateX(-50%)",
      }}
      className={cn(
        "absolute z-50 pointer-events-none transition-all duration-75",
        className
      )}
    >
      <div className="p-2.5 rounded-xl bg-[#090D17]/95 border border-white/20 shadow-2xl backdrop-blur-xl text-xs space-y-1.5 min-w-[200px] text-white">
        <div className="flex items-center justify-between border-b border-white/10 pb-1 gap-2">
          <span className="font-mono font-bold text-slate-200 text-[11px]">{dateStr}</span>
          <span
            className={cn(
              "text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border",
              status === "od"
                ? "bg-purple-500/20 text-purple-300 border-purple-400/30"
                : status === "present"
                ? "bg-white/10 text-white border-white/20"
                : status === "leave"
                ? "bg-amber-500/20 text-amber-300 border-amber-400/30"
                : "bg-zinc-800 text-slate-400 border-zinc-700"
            )}
          >
            {statusLabel}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Activity Intensity:</span>
          <span className="font-mono font-bold text-white">
            {hours} {hours === 1 ? "hour" : "hours"} logged
          </span>
        </div>

        {details && (
          <p className="text-[10px] text-slate-300 font-medium leading-tight">
            {details}
          </p>
        )}

        {rfid && (
          <p className="text-[9px] font-mono text-slate-400 border-t border-white/5 pt-1">
            RFID: {rfid}
          </p>
        )}
      </div>
      {/* Down arrow triangle */}
      <div className="w-2 h-2 bg-[#090D17] border-r border-b border-white/20 rotate-45 mx-auto -mt-1" />
    </div>
  );
}

export function HeatmapLegend({
  className,
  labelLess = "Less",
  labelMore = "More",
  showStats = true,
}: {
  className?: string;
  labelLess?: string;
  labelMore?: string;
  showStats?: boolean;
}) {
  const chartContext = useContext(HeatmapChartContext);
  const data = chartContext?.data || [];

  // Compute summary stats
  const totalHours = useMemo(() => {
    return data.reduce((sum, week) => {
      return sum + week.bins.reduce((wSum, b) => wSum + (b.count || 0), 0);
    }, 0);
  }, [data]);

  const activeDays = useMemo(() => {
    return data.reduce((sum, week) => {
      return sum + week.bins.filter((b) => b.count > 0).length;
    }, 0);
  }, [data]);

  const levels = [
    { level: 0, bg: "bg-[#111622]", border: "border-[#1E2536]", count: "0 hrs (Recess/Holiday)" },
    { level: 1, bg: "bg-[#242F42]", border: "border-[#35435D]", count: "1-2 hrs" },
    { level: 2, bg: "bg-[#475773]", border: "border-[#5E7192]", count: "3-4 hrs" },
    { level: 3, bg: "bg-[#8E9EB7]", border: "border-[#B5C4DC]", count: "5-6 hrs" },
    { level: 4, bg: "bg-[#F8FAFC]", border: "border-white", glow: "shadow-[0_0_6px_rgba(255,255,255,0.6)]", count: "7+ hrs (Peak Session / OD)" },
  ];

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400 select-none",
        className
      )}
    >
      {/* Monochrome Ramp Swatches */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-500 font-medium">{labelLess}</span>
        <div className="flex items-center gap-1">
          {levels.map((lvl) => (
            <span
              key={lvl.level}
              title={`Level ${lvl.level}: ${lvl.count}`}
              className={cn(
                "w-3 h-3 rounded-[2.5px] border cursor-help transition-transform hover:scale-125",
                lvl.bg,
                lvl.border,
                lvl.glow
              )}
            />
          ))}
        </div>
        <span className="text-[10px] text-slate-300 font-medium">{labelMore}</span>
      </div>

      {/* Summary Metrics */}
      {showStats && (
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-slate-400">
            Semester Logged: <strong className="text-white font-bold">{totalHours} hrs</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Active Days: <strong className="text-white font-bold">{activeDays} days</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-semibold">95.6% On-Track</span>
        </div>
      )}
    </div>
  );
}

