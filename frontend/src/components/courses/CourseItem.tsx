import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import type { Course } from "@/types/roadmap";
import { courseProgress, formatMinutes } from "@/lib/progress";
import { StatusRing } from "@/components/ui/StatusRing";

interface CourseItemProps {
  course: Course;
  accent: string;
  isActive: boolean;
  onCycleStatus: () => void;
  onStudy: () => void;
}

export function CourseItem({ course, accent, isActive, onCycleStatus, onStudy }: CourseItemProps) {
  const progress = courseProgress(course);
  const label =
    course.status === "completed" ? "Concluído" : course.status === "not_started" ? "Não iniciado" : `${progress}%`;

  return (
    <div
      className="group relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors"
      style={{ background: isActive ? `${accent}14` : "transparent" }}
    >
      <StatusRing progress={progress} color={accent} size={17} onClick={onCycleStatus} />

      <div className="min-w-0 flex-1">
        <div
          className="truncate text-[13px] font-medium"
          style={{ color: course.status === "not_started" ? "var(--color-ink-1)" : "var(--color-ink-0)" }}
        >
          {course.title}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10.5px]" style={{ color: "var(--color-ink-3)" }}>
          <span>{course.platform}</span>
          <span>·</span>
          <span className="tabular">{formatMinutes(course.durationMinutes)}</span>
          <span>·</span>
          <span
            className="tabular"
            style={{ color: course.status === "completed" ? accent : "var(--color-ink-3)" }}
          >
            {label}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {course.status !== "completed" && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              onStudy();
            }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            style={{ background: `${accent}22`, color: accent, opacity: isActive ? 1 : undefined }}
            aria-label="Estudar"
          >
            <Play size={11} strokeWidth={2.5} fill="currentColor" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
