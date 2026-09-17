import { AnimatePresence, motion } from "framer-motion";
import { Footprints, Timer, Landmark, Moon, Hourglass, Flame, Languages, Layers, Lock } from "lucide-react";
import { useRoadmap } from "@/hooks/useRoadmap";
import { accentOf } from "@/lib/accent";
import type { LucideIcon } from "lucide-react";

const GOLD = accentOf("gold").main;

const ICONS: Record<string, LucideIcon> = {
  footprints: Footprints,
  timer: Timer,
  landmark: Landmark,
  moon: Moon,
  hourglass: Hourglass,
  flame: Flame,
  languages: Languages,
  layers: Layers,
};

interface AchievementsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function AchievementsPanel({ open, onClose }: AchievementsPanelProps) {
  const { achievements } = useRoadmap();

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-4 top-16 z-50 w-[320px] overflow-hidden rounded-2xl"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "0 24px 60px -18px rgba(0,0,0,0.65)" }}
          >
            <div className="px-4 pb-3 pt-4">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-ink-3)" }}>
                Achievements
              </div>
            </div>
            <div className="flex max-h-[360px] flex-col gap-0.5 overflow-y-auto px-2 pb-2">
              {achievements.map((a) => {
                const Icon = ICONS[a.icon] ?? Footprints;
                return (
                  <div key={a.id} className="flex items-center gap-3 rounded-xl px-2.5 py-2.5" style={{ opacity: a.unlocked ? 1 : 0.5 }}>
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: a.unlocked ? `${GOLD}22` : "var(--color-surface-3)", color: a.unlocked ? GOLD : "var(--color-ink-3)" }}
                    >
                      {a.unlocked ? <Icon size={14} /> : <Lock size={12} />}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-[12.5px] font-semibold" style={{ color: "var(--color-ink-0)" }}>
                        {a.title}
                      </div>
                      <div className="truncate text-[10.5px]" style={{ color: "var(--color-ink-3)" }}>
                        {a.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
