import React from "react";

export interface VyseLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function VyseLogo({
  size = 36,
  showText = true,
  className = "",
}: VyseLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Apple Squircle Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-[1.03]"
      >
        {/* Continuous Curvature Squircle */}
        <rect
          width="48"
          height="48"
          rx="14"
          fill="#060608"
        />
        <rect
          x="0.75"
          y="0.75"
          width="46.5"
          height="46.5"
          rx="13.25"
          stroke="white"
          strokeOpacity="0.08"
          strokeWidth="1.5"
        />

        {/* Minimal Monoline V-Core */}
        <path
          d="M15.5 17.5L24 31L32.5 17.5"
          stroke="white"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Optical Center Focus Point */}
        <circle cx="24" cy="21.5" r="1.5" fill="white" fillOpacity="0.85" />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-normal tracking-[0.06em] text-white/90 font-sans">
            Vyse
          </span>
        </div>
      )}
    </div>
  );
}

export default VyseLogo;
