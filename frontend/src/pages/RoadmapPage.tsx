import { RoadmapCanvas } from "@/components/roadmap/RoadmapCanvas";
import { TechPanel } from "@/components/panel/TechPanel";

export function RoadmapPage() {
  return (
    <div className="relative h-full w-full pt-14">
      <RoadmapCanvas />
      <TechPanel />
    </div>
  );
}
