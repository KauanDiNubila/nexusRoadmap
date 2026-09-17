import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CATEGORIES, CROSS_LINKS, TECHS } from "@/data/roadmap";
import { categoryProgress, resolveTechStatus, techProgress } from "@/lib/progress";
import { atualizarStatusCurso, desbloquearConquista, fetchSnapshot, paraAchievement, registrarSessaoEstudo } from "@/lib/api";
import { usePomodoro, DEFAULT_POMODORO_CONFIG, type PomodoroState } from "@/hooks/usePomodoro";
import type {
  Achievement,
  ActiveCourseRef,
  CategoryDef,
  Course,
  CourseStatus,
  TechDef,
  TechStatus,
  UserProgress,
} from "@/types/roadmap";

export interface Toast {
  id: number;
  kind: "xp" | "achievement" | "levelup" | "unlock";
  title: string;
  detail?: string;
}

interface RoadmapContextValue {
  isLoading: boolean;
  categories: CategoryDef[];
  techs: TechDef[];
  techsById: Map<string, TechDef>;
  crossLinks: Array<{ from: string; to: string }>;

  getTechStatus: (id: string) => TechStatus;
  getTechProgress: (id: string) => number;
  getCategoryProgress: (categoryId: string) => number;
  overallProgress: number;

  selectedTechId: string | null;
  selectTech: (id: string | null) => void;

  setCourseStatus: (techId: string, courseId: string, status: CourseStatus) => void;
  cycleCourseStatus: (techId: string, courseId: string) => void;
  startStudying: (techId: string, courseId: string) => void;

  activeCourse: ActiveCourseRef | null;
  activeCourseInfo: { tech: TechDef; course: Course } | null;

  pomodoro: PomodoroState;
  isPomodoroWidgetOpen: boolean;
  setPomodoroWidgetOpen: (open: boolean) => void;

  userProgress: UserProgress;
  achievements: Achievement[];

  toasts: Toast[];
  dismissToast: (id: number) => void;
}

export const RoadmapContext = createContext<RoadmapContextValue | null>(null);

const EMPTY_USER_PROGRESS: UserProgress = {
  level: 1,
  xp: 0,
  xpToNext: 100,
  streakDays: 0,
  totalStudiedMinutes: 0,
  totalSessions: 0,
};

function cloneTechs(): TechDef[] {
  return TECHS.map((t) => ({ ...t, courses: t.courses.map((c) => ({ ...c })) }));
}

let toastSeq = 0;

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [techs, setTechs] = useState<TechDef[]>(cloneTechs);
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState<ActiveCourseRef | null>(null);
  const [isPomodoroWidgetOpen, setPomodoroWidgetOpen] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>(EMPTY_USER_PROGRESS);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const techsById = useMemo(() => new Map(techs.map((t) => [t.id, t])), [techs]);
  const activeCourseRef = useRef(activeCourse);
  activeCourseRef.current = activeCourse;

  useEffect(() => {
    let cancelled = false;

    fetchSnapshot().then((snapshot) => {
      if (cancelled) return;

      setUserProgress(snapshot.usuario);
      setAchievements(snapshot.conquistas.map(paraAchievement));

      const progressoPorCurso = new Map(snapshot.cursos.map((c) => [c.cursoId, c]));
      setTechs((prev) =>
        prev.map((t) => ({
          ...t,
          courses: t.courses.map((c) => {
            const progresso = progressoPorCurso.get(c.id);
            return progresso ? { ...c, status: progresso.status, studiedMinutes: progresso.studiedMinutes } : c;
          }),
        })),
      );

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const pushToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = ++toastSeq;
    setToasts((list) => [...list, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const unlockAchievement = useCallback(
    (id: string) => {
      setAchievements((list) => {
        const target = list.find((a) => a.id === id);
        if (!target || target.unlocked) return list;
        pushToast({ kind: "achievement", title: target.title, detail: target.description });
        return list.map((a) =>
          a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toISOString().slice(0, 10) } : a,
        );
      });
      desbloquearConquista(id).catch(() => undefined);
    },
    [pushToast],
  );

  const applyAchievementUnlocks = useCallback(
    (unlocked: Achievement[]) => {
      if (unlocked.length === 0) return;
      setAchievements((list) =>
        list.map((a) => {
          const match = unlocked.find((u) => u.id === a.id);
          if (!match || a.unlocked) return a;
          pushToast({ kind: "achievement", title: match.title, detail: match.description });
          return match;
        }),
      );
    },
    [pushToast],
  );

  const applyFocusMinutes = useCallback(
    async (minutes: number) => {
      const ref = activeCourseRef.current;
      if (!ref) return;

      const tech = techsById.get(ref.techId);
      const course = tech?.courses.find((c) => c.id === ref.courseId);
      if (!tech || !course) return;

      const wasCompleted = course.status === "completed";
      const response = await registrarSessaoEstudo(course.id, minutes, course.durationMinutes);

      setTechs((prev) =>
        prev.map((t) => {
          if (t.id !== tech.id) return t;
          return {
            ...t,
            courses: t.courses.map((c) =>
              c.id === course.id ? { ...c, status: response.curso.status, studiedMinutes: response.curso.studiedMinutes } : c,
            ),
          };
        }),
      );

      pushToast({ kind: "xp", title: `+${minutes} min estudados`, detail: course.title });

      if (!wasCompleted && response.curso.status === "completed") {
        pushToast({ kind: "unlock", title: `${course.title} concluído`, detail: tech.name });

        const categoryTechs = TECHS.filter((t) => t.categoryId === tech.categoryId).map((t) => {
          const current = techsById.get(t.id) ?? t;
          if (t.id !== tech.id) return current;
          return {
            ...current,
            courses: current.courses.map((c) => (c.id === course.id ? { ...c, status: "completed" as CourseStatus } : c)),
          };
        });
        const allDone = categoryTechs.every((t) => techProgress(t) === 100);
        if (allDone) unlockAchievement("architect");
      }

      setUserProgress(response.usuario);
      if (response.subiuDeNivel) {
        pushToast({ kind: "levelup", title: `Level ${response.usuario.level}`, detail: "Novo nível alcançado" });
      }
      applyAchievementUnlocks(response.conquistasDesbloqueadas.map(paraAchievement));
    },
    [pushToast, unlockAchievement, applyAchievementUnlocks, techsById],
  );

  const pomodoro = usePomodoro({ config: DEFAULT_POMODORO_CONFIG, onFocusComplete: applyFocusMinutes });

  const setCourseStatus = useCallback(
    (techId: string, courseId: string, status: CourseStatus) => {
      const tech = techsById.get(techId);
      const course = tech?.courses.find((c) => c.id === courseId);
      if (!course) return;

      atualizarStatusCurso(courseId, status, course.durationMinutes).then((resultado) => {
        setTechs((prev) =>
          prev.map((t) => {
            if (t.id !== techId) return t;
            return {
              ...t,
              courses: t.courses.map((c) =>
                c.id !== courseId ? c : { ...c, status: resultado.status, studiedMinutes: resultado.studiedMinutes },
              ),
            };
          }),
        );
      });
    },
    [techsById],
  );

  const cycleCourseStatus = useCallback(
    (techId: string, courseId: string) => {
      const tech = techsById.get(techId);
      const course = tech?.courses.find((c) => c.id === courseId);
      if (!course) return;
      const next: CourseStatus =
        course.status === "not_started" ? "in_progress" : course.status === "in_progress" ? "completed" : "not_started";
      setCourseStatus(techId, courseId, next);
    },
    [techsById, setCourseStatus],
  );

  const startStudying = useCallback(
    (techId: string, courseId: string) => {
      const tech = techsById.get(techId);
      const course = tech?.courses.find((c) => c.id === courseId);
      if (!tech || !course) return;
      if (course.status === "not_started") {
        setCourseStatus(techId, courseId, "in_progress");
      }
      setActiveCourse({ techId, courseId });
      setPomodoroWidgetOpen(true);
      pomodoro.start();
    },
    [techsById, setCourseStatus, pomodoro],
  );

  const getTechStatus = useCallback((id: string) => {
    const tech = techsById.get(id);
    if (!tech) return "locked" as TechStatus;
    return resolveTechStatus(tech, techsById);
  }, [techsById]);

  const getTechProgress = useCallback((id: string) => {
    const tech = techsById.get(id);
    return tech ? techProgress(tech) : 0;
  }, [techsById]);

  const getCategoryProgress = useCallback(
    (categoryId: string) => categoryProgress(techs.filter((t) => t.categoryId === categoryId)),
    [techs],
  );

  const overallProgress = useMemo(() => categoryProgress(techs), [techs]);

  const activeCourseInfo = useMemo(() => {
    if (!activeCourse) return null;
    const tech = techsById.get(activeCourse.techId);
    const course = tech?.courses.find((c) => c.id === activeCourse.courseId);
    if (!tech || !course) return null;
    return { tech, course };
  }, [activeCourse, techsById]);

  const value: RoadmapContextValue = {
    isLoading,
    categories: CATEGORIES,
    techs,
    techsById,
    crossLinks: CROSS_LINKS,
    getTechStatus,
    getTechProgress,
    getCategoryProgress,
    overallProgress,
    selectedTechId,
    selectTech: setSelectedTechId,
    setCourseStatus,
    cycleCourseStatus,
    startStudying,
    activeCourse,
    activeCourseInfo,
    pomodoro,
    isPomodoroWidgetOpen,
    setPomodoroWidgetOpen,
    userProgress,
    achievements,
    toasts,
    dismissToast,
  };

  return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>;
}
