import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Flame, Trophy } from "lucide-react";
import { useRoadmap } from "@/hooks/useRoadmap";
import { getIcon } from "@/lib/icons";
import { accentOf } from "@/lib/accent";
import { formatMinutes } from "@/lib/progress";

export function StatsPage() {
  const { categories, userProgress, overallProgress, getCategoryProgress, achievements } = useRoadmap();
  const xpRatio = Math.min(1, userProgress.xp / userProgress.xpToNext);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="h-full w-full overflow-y-auto nexus-canvas-bg pt-14">
      <div className="mx-auto max-w-[860px] px-5 pb-24 pt-10">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-8 rounded-2xl px-7 py-7"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full">
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: `conic-gradient(var(--color-violet) ${xpRatio * 360}deg, var(--color-border) 0deg)` }}
            />
            <span className="absolute inset-[6px] flex flex-col items-center justify-center rounded-full" style={{ background: "var(--color-surface)" }}>
              <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "var(--color-ink-3)" }}>
                Level
              </span>
              <span className="font-mono text-[26px] font-bold" style={{ color: "var(--color-ink-0)" }}>
                {userProgress.level}
              </span>
            </span>
          </div>

          <div className="min-w-[160px] flex-1">
            <div className="mb-1.5 flex items-center justify-between font-mono text-[10.5px] tabular" style={{ color: "var(--color-ink-3)" }}>
              <span>{userProgress.xp} XP</span>
              <span>{userProgress.xpToNext} XP</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--color-violet-dim), var(--color-violet))" }}
                initial={{ width: 0 }}
                animate={{ width: `${xpRatio * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-6">
              <MiniStat icon={<Flame size={13} style={{ color: "var(--color-ember)" }} />} label="streak" value={`${userProgress.streakDays} dias`} />
              <MiniStat label="estudado" value={formatMinutes(userProgress.totalStudiedMinutes)} />
              <MiniStat label="sessões" value={String(userProgress.totalSessions)} />
              <MiniStat label="roadmap" value={`${overallProgress}%`} />
              <MiniStat icon={<Trophy size={13} style={{ color: "var(--color-gold)" }} />} label="achievements" value={`${unlockedCount}/${achievements.length}`} />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 rounded-2xl px-2 py-2"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <div className="px-4 pb-1 pt-3 font-mono text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-ink-3)" }}>
            Progresso por área
          </div>
          <div className="flex flex-col">
            {categories.map((category) => {
              const accent = accentOf(category.accent);
              const Icon = getIcon(category.icon);
              const progress = getCategoryProgress(category.id);
              return (
                <div key={category.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${accent.main}1c`, color: accent.main }}>
                    <Icon size={14} />
                  </span>
                  <div className="w-32 shrink-0 truncate text-[12.5px] font-medium" style={{ color: "var(--color-ink-0)" }}>
                    {category.name}
                  </div>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: accent.main }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <div className="w-10 shrink-0 text-right font-mono text-[11px] tabular" style={{ color: "var(--color-ink-2)" }}>
                    {progress}%
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 font-mono text-[15px] font-bold tabular" style={{ color: "var(--color-ink-0)" }}>
        {icon}
        {value}
      </div>
      <div className="font-mono text-[9.5px] uppercase tracking-wide" style={{ color: "var(--color-ink-3)" }}>
        {label}
      </div>
    </div>
  );
}
