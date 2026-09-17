import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Trophy, TrendingUp, Unlock } from "lucide-react";
import { useRoadmap } from "@/hooks/useRoadmap";
import type { Toast } from "@/context/RoadmapContext";

const ICONS: Record<Toast["kind"], typeof Sparkles> = {
  xp: Sparkles,
  achievement: Trophy,
  levelup: TrendingUp,
  unlock: Unlock,
};

const COLORS: Record<Toast["kind"], string> = {
  xp: "var(--color-cyan)",
  achievement: "var(--color-gold)",
  levelup: "var(--color-violet)",
  unlock: "var(--color-emerald)",
};

export function ToastStack() {
  const { toasts, dismissToast } = useRoadmap();

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-[280px] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.kind];
          const color = COLORS[toast.kind];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => dismissToast(toast.id)}
              className="pointer-events-auto flex cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-3"
              style={{
                background: "var(--color-surface)",
                border: `1px solid ${color}40`,
                boxShadow: `0 16px 36px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02)`,
              }}
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ background: `${color}22`, color }}
              >
                <Icon size={13} />
              </span>
              <div className="min-w-0">
                <div className="truncate text-[12.5px] font-semibold" style={{ color: "var(--color-ink-0)" }}>
                  {toast.title}
                </div>
                {toast.detail && (
                  <div className="truncate text-[10.5px]" style={{ color: "var(--color-ink-3)" }}>
                    {toast.detail}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
