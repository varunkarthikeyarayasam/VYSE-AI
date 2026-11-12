import React from "react";
import { PieChart, PieSlice } from "@bklitui/ui/charts";
import { cn } from "@/lib/utils";

export interface AttendancePieChartProps {
  size?: number;
  className?: string;
  presentDays?: number;
  odDays?: number;
  leaveDays?: number;
  holidayDays?: number;
}

export default function SalesChart({
  size = 260,
  className,
  presentDays = 76,
  odDays = 4,
  leaveDays = 2,
  holidayDays = 8,
}: AttendancePieChartProps) {
  // Sticking strictly to the user's color scheme and images: #0ea5e9 (cyan), #a855f7 (purple), #f59e0b (amber), #10b981 (emerald)
  const data = [
    { label: "Present Sessions", value: presentDays, color: "#0ea5e9" },
    { label: "On-Duty Passes", value: odDays, color: "#a855f7" },
    { label: "Medical / Leave", value: leaveDays, color: "#f59e0b" },
    { label: "Campus Recess", value: holidayDays, color: "#10b981" },
  ];

  return (
    <div className={cn("flex flex-col items-center justify-center w-full", className)}>
      <PieChart data={data} size={size}>
        {data.map((_, index) => (
          <PieSlice key={index} index={index} />
        ))}
      </PieChart>
    </div>
  );
}

export { SalesChart, SalesChart as AttendanceDistributionPie };
