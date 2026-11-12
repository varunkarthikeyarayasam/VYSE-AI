import React from "react";
import { Sparkles } from "lucide-react";

export function ContextIndicator({ context }: { context: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#151B26] border border-[#283347] text-[11px] font-mono text-[#A78BFA] mb-2 select-none shadow-sm">
      <Sparkles className="w-3 h-3 text-[#60A5FA]" />
      <span className="text-[#CBD5E1]">Context:</span>
      <span className="font-semibold text-[#A78BFA]">{context}</span>
    </div>
  );
}