import React from "react";
import { RadarChart, RadarGrid, RadarAxis, RadarLabels, RadarArea } from "@bklitui/ui/charts";
import { cn } from "@/lib/utils";

export interface PerformanceRadarProps {
  size?: number;
  className?: string;
  isFaculty?: boolean;
}

const defaultMetrics = [
  { key: "theory", label: "Theory Lectures" },
  { key: "labs", label: "Lab Practicals" },
  { key: "od", label: "OD / Hackathons" },
  { key: "punctuality", label: "RFID Punctuality" },
  { key: "assignments", label: "Assessments" },
  { key: "discipline", label: "Campus Standing" },
];

export default function PerformanceRadar({
  size = 320,
  className,
  isFaculty = false,
}: PerformanceRadarProps) {
  const metrics = defaultMetrics;

  const data = [
    {
      label: isFaculty ? "Faculty Performance" : "Student Standing",
      color: "#3b82f6", // Electric Blue matching Aura/Stovest image
      values: isFaculty
        ? { theory: 96, labs: 94, od: 90, punctuality: 95, assignments: 98, discipline: 96 }
        : { theory: 86, labs: 92, od: 88, punctuality: 84, assignments: 90, discipline: 94 },
    },
    {
      label: "75% Required Minimum",
      color: "#f59e0b", // Warm Amber matching Aura/Stovest image
      values: { theory: 75, labs: 75, od: 75, punctuality: 75, assignments: 75, discipline: 75 },
    },
  ];

  return (
    <div className={cn("flex flex-col items-center justify-center w-full", className)}>
      <RadarChart data={data} metrics={metrics} size={size}>
        <RadarGrid levels={4} />
        <RadarAxis />
        <RadarLabels />
        {data.map((item, index) => (
          <RadarArea key={item.label} index={index} />
        ))}
      </RadarChart>
    </div>
  );
}

export { PerformanceRadar };
