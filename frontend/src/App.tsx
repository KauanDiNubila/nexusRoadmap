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
  const { isLoading } = useRoadmap();

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
