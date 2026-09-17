import { getBezierPath, type EdgeProps } from "reactflow";

export function RelationEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) {
  const [path] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, curvature: 0.25 });
  return (
    <path
      d={path}
      fill="none"
      stroke="var(--color-violet)"
      strokeWidth={1.2}
      strokeDasharray="1 5"
      strokeLinecap="round"
      opacity={0.35}
    />
  );
}
