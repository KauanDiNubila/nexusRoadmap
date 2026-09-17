import type { Course, TechDef, TechStatus } from "@/types/roadmap";

export function courseProgress(course: Course): number {
  if (course.status === "completed") return 100;
  if (course.status === "not_started") return 0;
  return Math.min(99, Math.round((course.studiedMinutes / course.durationMinutes) * 100));
}

export function techProgress(tech: TechDef): number {
  if (tech.courses.length === 0) return 0;
  const total = tech.courses.reduce((sum, c) => sum + courseProgress(c), 0);
  return Math.round(total / tech.courses.length);
}

/** courses-only status, ignoring prerequisites */
export function techCourseStatus(tech: TechDef): "not_started" | "in_progress" | "completed" {
  if (tech.courses.every((c) => c.status === "completed")) return "completed";
  if (tech.courses.some((c) => c.status !== "not_started")) return "in_progress";
  return "not_started";
}

/**
 * Full status including the locked state: a node unlocks once its
 * prerequisite has been started (courses in_progress or completed),
 * or immediately if it hangs directly off a category root.
 */
export function resolveTechStatus(tech: TechDef, techsById: Map<string, TechDef>): TechStatus {
  const courseStatus = techCourseStatus(tech);

  if (tech.parentId === null) {
    return courseStatus === "not_started" ? "available" : courseStatus;
  }

  const parent = techsById.get(tech.parentId);
  const parentUnlocked = parent ? techCourseStatus(parent) !== "not_started" : true;

  if (!parentUnlocked) return "locked";
  return courseStatus === "not_started" ? "available" : courseStatus;
}

export function categoryProgress(techs: TechDef[]): number {
  if (techs.length === 0) return 0;
  const total = techs.reduce((sum, t) => sum + techProgress(t), 0);
  return Math.round(total / techs.length);
}

export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
