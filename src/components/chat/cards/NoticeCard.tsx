import React from "react";
import { Bell, AlertTriangle, AlertCircle, Info, ChevronRight } from "lucide-react";

export interface NoticeItem {
  id: string;
  severity: "high" | "medium" | "info";
  title: string;
  relevance: string;
  date: string;
}

export function NoticeCard({ items }: { items: NoticeItem[] }) {
  const icons = {
    high: <span className="w-2 h-2 rounded-full bg-[#B5675C] shrink-0" />,
    medium: <span className="w-2 h-2 rounded-full bg-[#C29B38] shrink-0" />,
    info: <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] shrink-0" />,
  };

  const borders = {
    high: "border-[#B5675C]/30 hover:border-[#B5675C]/50",
    medium: "border-[#C29B38]/30 hover:border-[#C29B38]/50",
    info: "border-hairline hover:border-hairline-strong",
  };

  return (
    <div className="rounded-lg border border-hairline bg-[var(--bg-surface)] p-5 space-y-4 max-w-xl text-[var(--text-primary)] my-2">
      <div className="flex items-center justify-between pb-3 border-b border-hairline">
        <div className="flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          <h4 className="font-mono font-semibold text-[11px] tracking-[0.14em] text-[var(--text-tertiary)] uppercase">
            {items.length} RELEVANT CAMPUS UPDATES
          </h4>
        </div>
        <span className="text-[10px] font-mono tracking-wider text-[var(--text-secondary)] bg-[var(--bg-surface-2)] border border-hairline px-2 py-0.5 rounded">
          FILTERED FOR YOU
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 rounded-md bg-[var(--bg-surface-2)] border ${borders[n.severity]} transition-all space-y-1`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {icons[n.severity]}
                <h5 className="font-medium text-xs text-[var(--text-primary)]">{n.title}</h5>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-tertiary)]">{n.date}</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] pl-4">{n.relevance}</p>
          </div>
        ))}
      </div>

      <div className="pt-1 flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
        <span>Verified Institutional Knowledge</span>
        <span className="font-mono tracking-wider">Prioritized by VYSE</span>
      </div>
    </div>
  );
}