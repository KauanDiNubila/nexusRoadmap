import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipForward, ChevronDown, Timer, X } from "lucide-react";
import { useRoadmap } from "@/hooks/useRoadmap";
import { accentOf } from "@/lib/accent";
import { useState, type ReactNode } from "react";

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function PomodoroWidget() {
  const { pomodoro, isPomodoroWidgetOpen, setPomodoroWidgetOpen, activeCourseInfo, categories } = useRoadmap();
  const [minimized, setMinimized] = useState(false);

  if (!isPomodoroWidgetOpen) return null;

  const category = categories.find((c) => c.id === activeCourseInfo?.tech.categoryId);
  const accent = accentOf(category?.accent ?? "cyan");
  const isBreak = pomodoro.phase === "break";
  const phaseColor = isBreak ? "var(--color-emerald)" : accent.main;
  const ringProgress = pomodoro.totalSeconds > 0 ? 1 - pomodoro.secondsLeft / pomodoro.totalSeconds : 0;

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-40">
      <AnimatePresence mode="wait">
        {minimized ? (
          <motion.button
            key="mini"
            type="button"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            onClick={() => setMinimized(false)}
            className="pointer-events-auto flex items-center gap-2.5 rounded-full py-2 pl-2 pr-4"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "0 12px 30px -12px rgba(0,0,0,0.6)" }}
          >
            <MiniRing progress={ringProgress} color={phaseColor} running={pomodoro.runState === "running"} />
            <span className="font-mono text-[13px] font-semibold tabular" style={{ color: "var(--color-ink-0)" }}>
              {formatClock(pomodoro.secondsLeft)}
            </span>
            {activeCourseInfo && (
              <span className="max-w-[110px] truncate text-[11px]" style={{ color: "var(--color-ink-2)" }}>
                {activeCourseInfo.course.title}
              </span>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto w-[264px] overflow-hidden rounded-2xl"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "0 24px 60px -18px rgba(0,0,0,0.65)" }}
          >
            <div className="flex items-center justify-between px-4 pt-3.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest" style={{ color: phaseColor }}>
                {isBreak ? "Break" : "Focus Session"}
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setMinimized(true)}
                  className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-3)]"
                  style={{ color: "var(--color-ink-3)" }}
                  aria-label="Minimizar"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    pomodoro.reset();
                    setPomodoroWidgetOpen(false);
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-3)]"
                  style={{ color: "var(--color-ink-3)" }}
                  aria-label="Fechar"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center px-4 pb-1 pt-1">
              <div className="font-mono text-[38px] font-bold tabular leading-tight" style={{ color: "var(--color-ink-0)" }}>
                {formatClock(pomodoro.secondsLeft)}
              </div>
              {activeCourseInfo ? (
                <div className="mt-0.5 max-w-full text-center">
                  <div className="truncate text-[12.5px] font-medium" style={{ color: "var(--color-ink-1)" }}>
                    {activeCourseInfo.course.title}
                  </div>
                  <div className="font-mono text-[10px]" style={{ color: "var(--color-ink-3)" }}>
                    {activeCourseInfo.course.platform}
                  </div>
                </div>
              ) : (
                <div className="mt-0.5 text-[11px]" style={{ color: "var(--color-ink-3)" }}>
                  Sessão livre
                </div>
              )}
            </div>

            <div className="mt-2.5 flex items-center justify-center gap-1.5 py-1">
              {Array.from({ length: 4 }).map((_, i) => {
                const filled = i < pomodoro.sessionsCompleted % 4;
                return (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: filled ? phaseColor : "var(--color-border)" }}
                  />
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5 border-t px-3 py-3" style={{ borderColor: "var(--color-border-soft)" }}>
              <IconButton onClick={pomodoro.reset} label="Reset">
                <RotateCcw size={14} />
              </IconButton>
              <IconButton
                primary
                color={phaseColor}
                onClick={pomodoro.runState === "running" ? pomodoro.pause : pomodoro.resume}
                label={pomodoro.runState === "running" ? "Pause" : "Resume"}
              >
                {pomodoro.runState === "running" ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              </IconButton>
              <IconButton onClick={pomodoro.skip} label="Skip">
                <SkipForward size={14} />
              </IconButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  label,
  primary,
  color,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
  primary?: boolean;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 items-center justify-center rounded-lg transition-transform active:scale-95"
      style={{
        background: primary ? `${color}22` : "var(--color-surface-2)",
        color: primary ? color : "var(--color-ink-2)",
      }}
    >
      {children}
    </button>
  );
}

function MiniRing({ progress, color, running }: { progress: number; color: string; running: boolean }) {
  return (
    <span className="relative flex h-7 w-7 items-center justify-center rounded-full">
      <span
        className="absolute inset-0 rounded-full"
        style={{ background: `conic-gradient(${color} ${progress * 360}deg, var(--color-border) 0deg)` }}
      />
      <span className="absolute inset-[3px] rounded-full" style={{ background: "var(--color-surface)" }} />
      <Timer size={11} className={running ? "animate-pulse-slow" : ""} style={{ color, position: "relative" }} />
    </span>
  );
}
