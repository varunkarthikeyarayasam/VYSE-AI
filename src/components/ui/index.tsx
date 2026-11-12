import React from "react";
import clsx from "clsx";
import PortalFieldCollection from "./portal-field";

export { PortalFieldCollection };
export * from "./portal-field";
export * from "./charts";
export * from "./VyseLogo";
export * from "./StrokeText";

// ==========================================
// CORE OBSIDIAN CHROME UI COMPONENTS
// ==========================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glow";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  // Base: primary is solid off-white pill, others are sharp 4-6px radius
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer";

  const variants = {
    // Deliberate contrast: Primary CTA is solid off-white pill
    primary:
      "rounded-full bg-[var(--cta-solid)] text-[var(--cta-solid-text)] hover:opacity-90 active:scale-[0.99] font-semibold tracking-wide shadow-xs",
    // Secondary: Sharp 6px radius, hairline border, surface background
    secondary:
      "rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] active:scale-[0.99]",
    // Ghost: Transparent with hover contrast
    ghost:
      "rounded-md bg-transparent hover:bg-white/[0.05] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
    // Danger: Muted brick tone (desaturated, not Tailwind saturated red)
    danger:
      "rounded-md bg-[#B5675C]/10 hover:bg-[#B5675C]/20 text-[#B5675C] border border-[#B5675C]/30",
    // Glow / Chrome: Brushed metal panel accent
    glow:
      "rounded-full bg-gradient-to-r from-[#EAEBED] via-[#FFFFFF] to-[#9CA0A6] text-[#0B0C0E] hover:opacity-95 font-semibold tracking-wide",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-xs sm:text-sm px-4 py-2 gap-2",
    lg: "text-sm sm:text-base px-6 py-2.5 gap-2.5",
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "rounded-lg p-5 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border-hairline)] transition-all duration-200",
        onClick && "cursor-pointer hover:border-[var(--border-hairline-strong)] hover:scale-[1.01] active:scale-[0.99]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className,
}: {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "glow";
  size?: "sm" | "md";
  className?: string;
}) {
  // Deliberate contrast: Tag chips are rounded-full with hairline borders and desaturated tones
  const styles = {
    success: "bg-[#7A8C7A]/10 text-[#7A8C7A] border-[#7A8C7A]/30",
    warning: "bg-[#C29B38]/10 text-[#C29B38] border-[#C29B38]/30",
    danger: "bg-[#B5675C]/10 text-[#B5675C] border-[#B5675C]/30",
    info: "bg-white/[0.04] text-[var(--text-primary)] border-[var(--border-hairline-strong)]",
    neutral: "bg-transparent text-[var(--text-tertiary)] border-[var(--border-hairline)]",
    glow: "bg-white/[0.04] text-[var(--text-primary)] border-[var(--border-hairline-strong)]",
  };

  const sizes = {
    sm: "text-[10px] font-mono uppercase tracking-[0.14em] px-2.5 py-0.5",
    md: "text-[11px] font-mono uppercase tracking-[0.12em] px-3 py-1",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium rounded-full border select-none",
        styles[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "text-[11px] uppercase tracking-[0.16em] text-[var(--text-tertiary)] font-mono font-semibold select-none",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
      <div
        className={clsx(
          "w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 shadow-2xl text-[var(--text-primary)]",
          maxWidth
        )}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-hairline)] mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)] font-mono">{title}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md border border-[var(--border-hairline)] hover:border-[var(--border-hairline-strong)] bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-white flex items-center justify-center transition-colors text-xs font-mono cursor-pointer"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}