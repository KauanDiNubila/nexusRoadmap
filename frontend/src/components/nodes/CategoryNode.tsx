import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { motion } from "framer-motion";
import { useRoadmap } from "@/hooks/useRoadmap";
import { getIcon } from "@/lib/icons";
import { accentOf } from "@/lib/accent";

export interface CategoryNodeData {
  categoryId: string;
}

function CategoryNodeImpl({ data }: NodeProps<CategoryNodeData>) {
  const { categories, getCategoryProgress } = useRoadmap();
  const category = categories.find((c) => c.id === data.categoryId);
  if (!category) return null;

  const accent = accentOf(category.accent);
  const progress = getCategoryProgress(category.id);
  const Icon = getIcon(category.icon);
  const complete = progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-[196px] select-none"
    >
      <div
        className="rounded-xl px-4 py-3.5"
        style={{
          background: `linear-gradient(160deg, ${accent.main}1a, var(--color-surface-2))`,
          border: `1px solid ${accent.main}4d`,
          boxShadow: complete ? `0 0 26px -8px ${accent.main}70` : `0 0 20px -10px ${accent.main}40`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ background: `${accent.main}26`, color: accent.main }}
          >
            <Icon size={16} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="truncate font-mono text-[12.5px] font-bold tracking-wider uppercase" style={{ color: "var(--color-ink-0)" }}>
              {category.name}
            </div>
            <div className="font-mono text-[10px] tabular" style={{ color: accent.main }}>
              {progress}% mapeado
            </div>
          </div>
        </div>

        <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${accent.dim}, ${accent.main})` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ width: 6, height: 6, background: accent.main, border: "none", opacity: 0.9 }}
      />
    </motion.div>
  );
}

export const CategoryNode = memo(CategoryNodeImpl);
