import { getBezierPath, type EdgeProps } from "reactflow";
import type { TechStatus } from "@/types/roadmap";

export interface SkillEdgeData {
  accentMain: string;
  targetStatus: TechStatus;
}

export function SkillEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<SkillEdgeData>) {
  const [path] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, curvature: 0.42 });
  const status = data?.targetStatus ?? "locked";
  const accent = data?.accentMain ?? "#3ee1ff";

  if (status === "locked") {
    return (
      <path
        d={path}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={1.4}
        strokeDasharray="1.5 6"
        strokeLinecap="round"
        opacity={0.6}
      />
    );
  }

  if (status === "completed") {
    return (
      <path
        d={path}
        fill="none"
        stroke={accent}
        strokeWidth={2}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 3px ${accent}80)` }}
        opacity={0.9}
      />
    );
  }

  if (status === "in_progress") {
    return (
      <path
        d={path}
        fill="none"
        stroke={accent}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeDasharray="5 5"
        className="animate-dash"
        opacity={0.85}
      />
    );
  }

  // available
  return (
    <path
      d={path}
      fill="none"
      stroke="var(--color-ink-3)"
      strokeWidth={1.5}
      strokeLinecap="round"
      opacity={0.7}
    />
  );
}
