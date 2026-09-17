import { useState } from "react";
import { RoadmapProvider } from "@/context/RoadmapContext";
import { useRoadmap } from "@/hooks/useRoadmap";
import { TopNav, type ViewKey } from "@/components/ui/TopNav";
import { PomodoroWidget } from "@/components/pomodoro/PomodoroWidget";
import { ToastStack } from "@/components/ui/ToastStack";
import { RoadmapPage } from "@/pages/RoadmapPage";
import { StatsPage } from "@/pages/StatsPage";

function AppShell() {
  const [view, setView] = useState<ViewKey>("roadmap");
  const { isLoading, loadError, retryLoad } = useRoadmap();

  if (loadError) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 px-6 text-center" style={{ background: "var(--color-void)" }}>
        <p className="font-mono text-sm" style={{ color: "var(--color-ink-3)" }}>{loadError}</p>
        <button
          onClick={retryLoad}
          className="rounded-md border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors hover:opacity-80"
          style={{ borderColor: "var(--color-border)", color: "var(--color-ink-0)" }}
        >
          Tentar de novo
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center font-mono text-sm" style={{ background: "var(--color-void)", color: "var(--color-ink-3)" }}>
        Carregando progresso...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden" style={{ background: "var(--color-void)" }}>
      <TopNav view={view} onViewChange={setView} />
      <main className="h-full w-full">
        {view === "roadmap" ? <RoadmapPage /> : <StatsPage />}
      </main>
      <PomodoroWidget />
      <ToastStack />
    </div>
  );
}

function App() {
  return (
    <RoadmapProvider>
      <AppShell />
    </RoadmapProvider>
  );
}

export default App;
