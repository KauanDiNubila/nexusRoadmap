import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useRoadmap } from "@/hooks/useRoadmap";
import { getIcon } from "@/lib/icons";
import { accentOf } from "@/lib/accent";
import { formatMinutes, techProgress } from "@/lib/progress";
import { CourseItem } from "@/components/courses/CourseItem";
import type { CategoryDef, TechDef, TechStatus } from "@/types/roadmap";

function breadcrumbFor(techId: string, techsById: Map<string, TechDef>): string[] {
  const trail: string[] = [];
  let current = techsById.get(techId);
  while (current) {
    trail.unshift(current.name);
    current = current.parentId ? techsById.get(current.parentId) : undefined;
  }
  return trail;
}

export function TechPanel() {
  const {
    selectedTechId,
    selectTech,
    techsById,
    categories,
    getTechStatus,
    activeCourse,
    cycleCourseStatus,
    startStudying,
  } = useRoadmap();

  const tech = selectedTechId ? techsById.get(selectedTechId) : null;

  return (
    <AnimatePresence>
      {tech && (
        <motion.aside
          key={tech.id}
          initial={{ x: 32, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 32, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto fixed right-4 top-20 bottom-4 z-30 flex w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 24px 60px -20px rgba(0,0,0,0.6)",
          }}
        >
          <PanelContent
            tech={tech}
            categories={categories}
            techsById={techsById}
            status={getTechStatus(tech.id)}
            activeCourseId={activeCourse?.techId === tech.id ? activeCourse.courseId : null}
            onClose={() => selectTech(null)}
            onCycleStatus={(courseId) => cycleCourseStatus(tech.id, courseId)}
            onStudy={(courseId) => startStudying(tech.id, courseId)}
          />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

interface PanelContentProps {
  tech: TechDef;
  categories: CategoryDef[];
  techsById: Map<string, TechDef>;
  status: TechStatus;
  activeCourseId: string | null;
  onClose: () => void;
  onCycleStatus: (courseId: string) => void;
  onStudy: (courseId: string) => void;
}

function PanelContent({ tech, categories, techsById, status, activeCourseId, onClose, onCycleStatus, onStudy }: PanelContentProps) {
  const category = categories.find((c) => c.id === tech.categoryId);
  const accent = accentOf(category?.accent ?? "cyan");
  const Icon = getIcon(tech.icon);
  const progress = techProgress(tech);
  const trail = [category?.name ?? "", ...breadcrumbFor(tech.id, techsById).slice(0, -1)].filter(Boolean);

  const totalStudied = tech.courses.reduce((sum, c) => sum + c.studiedMinutes, 0);
  const completedCount = tech.courses.filter((c) => c.status === "completed").length;

  return (
    <>
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4" style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
        <div className="min-w-0">
          <div className="font-mono text-[10.5px] uppercase tracking-wide" style={{ color: "var(--color-ink-3)" }}>
            {trail.join(" / ") || "Roadmap"}
          </div>
          <div className="mt-1 flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: `${accent.main}22`, color: accent.main }}
            >
              <Icon size={16} strokeWidth={2.2} />
            </div>
            <h2 className="truncate text-[17px] font-bold tracking-tight" style={{ color: "var(--color-ink-0)" }}>
              {tech.name}
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-3)]"
          style={{ color: "var(--color-ink-2)" }}
          aria-label="Fechar"
        >
          <X size={15} />
        </button>
      </div>

      <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
        <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--color-ink-2)" }}>
          {tech.summary}
        </p>

        <div className="mt-3.5 flex items-baseline justify-between">
          <span className="font-mono text-[11px] font-semibold tracking-wide" style={{ color: accent.main }}>
            {progress}% {status === "completed" ? "DOMINADO" : "COMPLETO"}
          </span>
          {status === "locked" && (
            <span className="font-mono text-[10px] uppercase" style={{ color: "var(--color-ink-3)" }}>
              bloqueado
            </span>
          )}
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${accent.dim}, ${accent.main})` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="estudadas" value={formatMinutes(totalStudied)} />
          <Stat label="cursos" value={String(tech.courses.length)} />
          <Stat label="concluídos" value={String(completedCount)} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="px-2 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-ink-3)" }}>
          Cursos
        </div>
        <div className="flex flex-col gap-0.5">
          {tech.courses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              accent={accent.main}
              isActive={course.id === activeCourseId}
              onCycleStatus={() => onCycleStatus(course.id)}
              onStudy={() => onStudy(course.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg px-2.5 py-2" style={{ background: "var(--color-surface-2)" }}>
      <div className="font-mono text-[13px] font-bold tabular" style={{ color: "var(--color-ink-0)" }}>
        {value}
      </div>
      <div className="font-mono text-[9px] uppercase tracking-wide" style={{ color: "var(--color-ink-3)" }}>
        {label}
      </div>
    </div>
  );
}
