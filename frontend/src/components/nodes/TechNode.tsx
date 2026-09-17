import { memo, type CSSProperties } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { useRoadmap } from "@/hooks/useRoadmap";
import { getIcon } from "@/lib/icons";
import { accentOf } from "@/lib/accent";

export interface TechNodeData {
  techId: string;
}

function TechNodeImpl({ data, selected }: NodeProps<TechNodeData>) {
  const { techsById, categories, getTechStatus, getTechProgress, selectTech } = useRoadmap();
  const tech = techsById.get(data.techId);
  if (!tech) return null;

  const category = categories.find((c) => c.id === tech.categoryId);
  const accent = accentOf(category?.accent ?? "cyan");
  const status = getTechStatus(tech.id);
  const progress = getTechProgress(tech.id);
  const Icon = getIcon(tech.icon);
  const locked = status === "locked";
  const completed = status === "completed";
  const inProgress = status === "in_progress";

  const borderColor = locked ? "var(--color-border)" : completed ? accent.main : inProgress ? accent.main : "var(--color-border)";
  const glow = completed
    ? `0 0 0 1px ${accent.main}33, 0 0 24px -6px ${accent.main}66`
    : inProgress
      ? `0 0 0 1px ${accent.main}22, 0 0 18px -8px ${accent.main}55`
      : selected
        ? `0 0 0 1px ${accent.main}55`
        : "none";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: locked ? 1 : 1.035 }}
      onClick={() => !locked && selectTech(tech.id)}
      className="relative w-[172px] select-none"
      style={{ opacity: locked ? 0.55 : 1 }}
    >
      <Handle type="target" position={Position.Top} style={handleStyle(accent.main, locked)} />

      {/* corner brackets */}
      {(["tl", "tr", "bl", "br"] as const).map((corner) => (
        <span
          key={corner}
          className="pointer-events-none absolute h-2.5 w-2.5"
          style={{
            ...cornerPos(corner),
            borderColor: locked ? "var(--color-border)" : accent.main,
            opacity: locked ? 0.5 : 0.85,
          }}
        />
      ))}

      <div
        className="rounded-[10px] px-3.5 py-3 transition-colors"
        style={{
          background: completed ? `linear-gradient(160deg, ${accent.main}14, var(--color-surface))` : "var(--color-surface)",
          border: `1px solid ${borderColor}`,
          boxShadow: glow,
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
            style={{ background: locked ? "var(--color-surface-3)" : `${accent.main}1c`, color: locked ? "var(--color-ink-3)" : accent.main }}
          >
            <Icon size={13} strokeWidth={2.25} />
          </div>
          {locked && <Lock size={11} className="text-[var(--color-ink-3)]" />}
          {completed && <Check size={13} style={{ color: accent.main }} strokeWidth={3} />}
        </div>

        <div
          className="mt-2 truncate font-mono text-[11px] font-semibold tracking-wide uppercase"
          style={{ color: locked ? "var(--color-ink-2)" : "var(--color-ink-0)" }}
        >
          {tech.name}
        </div>

        {!locked && (
          <div className="mt-2">
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: accent.main }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <div className="mt-1 font-mono text-[10px] tabular" style={{ color: "var(--color-ink-2)" }}>
              {progress}%
            </div>
          </div>
        )}
        {locked && (
          <div className="mt-2 font-mono text-[9.5px] tracking-wide uppercase" style={{ color: "var(--color-ink-3)" }}>
            bloqueado
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={handleStyle(accent.main, locked)} />
    </motion.div>
  );
}

function handleStyle(color: string, locked: boolean): CSSProperties {
  return {
    width: 6,
    height: 6,
    background: locked ? "var(--color-ink-3)" : color,
    border: "none",
    opacity: locked ? 0.4 : 0.9,
  };
}

function cornerPos(corner: "tl" | "tr" | "bl" | "br"): CSSProperties {
  const base: CSSProperties = { borderStyle: "solid" };
  if (corner === "tl") return { ...base, top: -1, left: -1, borderWidth: "1.5px 0 0 1.5px" };
  if (corner === "tr") return { ...base, top: -1, right: -1, borderWidth: "1.5px 1.5px 0 0" };
  if (corner === "bl") return { ...base, bottom: -1, left: -1, borderWidth: "0 0 1.5px 1.5px" };
  return { ...base, bottom: -1, right: -1, borderWidth: "0 1.5px 1.5px 0" };
}

export const TechNode = memo(TechNodeImpl);
