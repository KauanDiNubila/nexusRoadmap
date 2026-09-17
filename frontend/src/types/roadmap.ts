export type CourseStatus = "not_started" | "in_progress" | "completed";

export interface Course {
  id: string;
  title: string;
  platform: "Alura" | "Udemy" | "Coursera" | "YouTube";
  url: string;
  durationMinutes: number;
  studiedMinutes: number;
  status: CourseStatus;
}

export type NodeKind = "category" | "tech";

export type TechStatus = "locked" | "available" | "in_progress" | "completed";

export interface CategoryDef {
  id: string;
  name: string;
  description: string;
  accent: CategoryAccent;
  icon: string;
}

export type CategoryAccent =
  | "cyan"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "ember"
  | "sky"
  | "teal"
  | "indigo"
  | "gold";

export interface TechDef {
  id: string;
  name: string;
  categoryId: string;
  /** id of the tech node this one depends on, or null if it hangs directly off the category root */
  parentId: string | null;
  icon: string;
  summary: string;
  courses: Course[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNext: number;
  streakDays: number;
  totalStudiedMinutes: number;
  totalSessions: number;
}

export interface PomodoroConfig {
  focusMinutes: number;
  breakMinutes: number;
  sessionsBeforeLongBreak: number;
}

export type PomodoroPhase = "focus" | "break" | "idle";
export type PomodoroRunState = "idle" | "running" | "paused";

export interface ActiveCourseRef {
  techId: string;
  courseId: string;
}
