import type { CategoryAccent } from "@/types/roadmap";

export const ACCENT_COLORS: Record<CategoryAccent, { main: string; dim: string }> = {
  cyan: { main: "#3ee1ff", dim: "#1d6b7d" },
  violet: { main: "#9b8cff", dim: "#4a4380" },
  emerald: { main: "#46e0a8", dim: "#1f6b52" },
  amber: { main: "#ffb454", dim: "#8a5f28" },
  rose: { main: "#ff6b8b", dim: "#833c50" },
  ember: { main: "#ff8a5b", dim: "#86492c" },
  sky: { main: "#6bb8ff", dim: "#33608c" },
  teal: { main: "#3fd6c4", dim: "#1f6c62" },
  indigo: { main: "#8892ff", dim: "#454b8f" },
  gold: { main: "#f0cf6b", dim: "#7d6b2e" },
};

export function accentOf(accent: CategoryAccent): { main: string; dim: string } {
  return ACCENT_COLORS[accent] ?? ACCENT_COLORS.cyan;
}
