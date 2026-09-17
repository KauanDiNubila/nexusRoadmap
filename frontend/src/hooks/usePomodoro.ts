import { useCallback, useEffect, useRef, useState } from "react";
import type { PomodoroConfig, PomodoroPhase, PomodoroRunState } from "@/types/roadmap";

export const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
  focusMinutes: 25,
  breakMinutes: 5,
  sessionsBeforeLongBreak: 4,
};

interface UsePomodoroOptions {
  config?: PomodoroConfig;
  onFocusComplete?: (minutesStudied: number) => void;
}

export interface PomodoroState {
  phase: PomodoroPhase;
  runState: PomodoroRunState;
  secondsLeft: number;
  totalSeconds: number;
  sessionsCompleted: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
}

export function usePomodoro({ config = DEFAULT_POMODORO_CONFIG, onFocusComplete }: UsePomodoroOptions = {}): PomodoroState {
  const [phase, setPhase] = useState<PomodoroPhase>("idle");
  const [runState, setRunState] = useState<PomodoroRunState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(config.focusMinutes * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const onFocusCompleteRef = useRef(onFocusComplete);
  onFocusCompleteRef.current = onFocusComplete;

  const totalSeconds = phase === "break" ? config.breakMinutes * 60 : config.focusMinutes * 60;

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const start = useCallback(() => {
    setPhase("focus");
    setSecondsLeft(config.focusMinutes * 60);
    setRunState("running");
  }, [config.focusMinutes]);

  const pause = useCallback(() => {
    setRunState((s) => (s === "running" ? "paused" : s));
  }, []);

  const resume = useCallback(() => {
    setRunState((s) => (s === "paused" ? "running" : s));
  }, []);

  const reset = useCallback(() => {
    clear();
    setPhase("idle");
    setRunState("idle");
    setSecondsLeft(config.focusMinutes * 60);
  }, [clear, config.focusMinutes]);

  const finishPhase = useCallback(() => {
    if (phase === "focus") {
      onFocusCompleteRef.current?.(config.focusMinutes);
      setSessionsCompleted((n) => n + 1);
      setPhase("break");
      setSecondsLeft(config.breakMinutes * 60);
      setRunState("running");
    } else {
      setPhase("focus");
      setSecondsLeft(config.focusMinutes * 60);
      setRunState("running");
    }
  }, [phase, config.focusMinutes, config.breakMinutes]);

  const skip = useCallback(() => {
    if (phase === "idle") return;
    finishPhase();
  }, [phase, finishPhase]);

  useEffect(() => {
    if (runState !== "running") {
      clear();
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.setTimeout(finishPhase, 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runState, phase]);

  return { phase, runState, secondsLeft, totalSeconds, sessionsCompleted, start, pause, resume, reset, skip };
}
