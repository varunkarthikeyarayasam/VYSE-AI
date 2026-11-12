export type ThemeVariant = "graphite" | "navy";

export function getStoredTheme(): ThemeVariant {
  if (typeof window === "undefined") return "graphite";
  const saved = localStorage.getItem("vyse_theme");
  return saved === "navy" ? "navy" : "graphite";
}

export function applyTheme(theme: ThemeVariant) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("vyse_theme", theme);
}

export function toggleTheme(): ThemeVariant {
  const current = getStoredTheme();
  const next: ThemeVariant = current === "graphite" ? "navy" : "graphite";
  applyTheme(next);
  return next;
}
