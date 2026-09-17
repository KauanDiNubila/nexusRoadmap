import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Hexagon } from "lucide-react";
import { useRoadmap } from "@/hooks/useRoadmap";
import { formatMinutes } from "@/lib/progress";
import { AchievementsPanel } from "@/components/achievements/AchievementsPanel";

export type ViewKey = "roadmap" | "stats";

const NAV_ITEMS: Array<{ key: ViewKey; label: string }> = [
  { key: "roadmap", label: "Roadmap" },
  { key: "stats", label: "Stats" },
];

interface TopNavProps {
  view: ViewKey;
  onViewChange: (view: ViewKey) => void;
}

export function TopNav({ view, onViewChange }: TopNavProps) {
  const { userProgress, overallProgress, achievements } = useRoadmap();
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const xpRatio = Math.min(1, userProgress.xp / userProgress.xpToNext);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between px-4 sm:px-5"
      style={{
        background: "rgba(10,11,16,0.72)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--color-border-soft)",
      }}
    >
      <div className="flex items-center gap-2">
        <Hexagon size={18} strokeWidth={2.4} style={{ color: "var(--color-cyan)" }} />
        <span className="font-mono text-[13px] font-bold tracking-[0.18em]" style={{ color: "var(--color-ink-0)" }}>
          NEXUS
        </span>
      </div>

      <nav className="hidden items-center gap-1 rounded-full p-1 sm:flex" style={{ background: "var(--color-surface-2)" }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onViewChange(item.key)}
            className="relative rounded-full px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wide transition-colors"
            style={{ color: view === item.key ? "var(--color-ink-0)" : "var(--color-ink-3)" }}
          >
            {view === item.key && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--color-surface-3)" }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <span className="relative">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <div className="hidden items-center gap-1 font-mono text-[11px] tabular md:flex" style={{ color: "var(--color-ink-2)" }}>
          <Flame size={13} style={{ color: "var(--color-ember)" }} />
          {userProgress.streakDays}
        </div>

        <div className="hidden font-mono text-[11px] tabular lg:block" style={{ color: "var(--color-ink-2)" }}>
          {formatMinutes(userProgress.totalStudiedMinutes)}
        </div>

        <div className="hidden font-mono text-[11px] tabular lg:block" style={{ color: "var(--color-ink-2)" }}>
          {overallProgress}% roadmap
        </div>

        <button
          type="button"
          onClick={() => setAchievementsOpen((v) => !v)}
          className="relative flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{ background: achievementsOpen ? "var(--color-surface-3)" : "transparent", color: "var(--color-gold)" }}
          aria-label="Conquistas"
        >
          <Trophy size={15} />
          <span
            className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full font-mono text-[8px] font-bold"
            style={{ background: "var(--color-gold)", color: "var(--color-void)" }}
          >
            {unlockedCount}
          </span>
        </button>

        <div
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3"
          style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border-soft)" }}
        >
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full">
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: `conic-gradient(var(--color-violet) ${xpRatio * 360}deg, var(--color-border) 0deg)` }}
            />
            <span className="absolute inset-[2px] rounded-full" style={{ background: "var(--color-surface-2)" }} />
          </span>
          <span className="font-mono text-[10.5px] font-semibold tabular" style={{ color: "var(--color-ink-1)" }}>
            LVL {userProgress.level}
          </span>
        </div>
      </div>

      <AchievementsPanel open={achievementsOpen} onClose={() => setAchievementsOpen(false)} />
    </header>
  );
}
