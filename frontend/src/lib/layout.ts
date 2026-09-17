import { CATEGORIES, TECHS } from "@/data/roadmap";
import type { TechDef } from "@/types/roadmap";

export interface LaidOutNode {
  id: string;
  x: number;
  y: number;
}

const X_GAP = 260;
const Y_GAP = 168;
const CATEGORY_GAP_X = 120;

/**
 * Lays out each category as an independent tree (root category node at the top,
 * tech nodes cascading downward) and places the trees side by side across the canvas.
 */
export function layoutRoadmap(): { positions: Map<string, LaidOutNode>; categoryWidths: Map<string, number> } {
  const positions = new Map<string, LaidOutNode>();
  const categoryWidths = new Map<string, number>();

  let cursorX = 0;

  for (const category of CATEGORIES) {
    const techs = TECHS.filter((t) => t.categoryId === category.id);
    const byParent = new Map<string | null, TechDef[]>();
    for (const t of techs) {
      const list = byParent.get(t.parentId) ?? [];
      list.push(t);
      byParent.set(t.parentId, list);
    }

    // assign a "column slot" to every node via a post-order leaf count, so
    // siblings and their descendants never overlap horizontally.
    const slot = new Map<string, number>();
    let nextSlot = 0;

    function assignSlots(techId: string | null): number {
      const children = byParent.get(techId) ?? [];
      if (children.length === 0) {
        if (techId !== null) slot.set(techId, nextSlot);
        return nextSlot++;
      }
      const childSlots = children.map((c) => assignSlots(c.id));
      const center = (Math.min(...childSlots) + Math.max(...childSlots)) / 2;
      if (techId !== null) slot.set(techId, center);
      return center;
    }

    const roots = byParent.get(null) ?? [];
    for (const root of roots) {
      assignSlots(root.id);
    }

    const depth = new Map<string, number>();
    function assignDepth(techId: string, d: number) {
      depth.set(techId, d);
      const children = byParent.get(techId) ?? [];
      for (const c of children) assignDepth(c.id, d + 1);
    }
    for (const root of roots) assignDepth(root.id, 1);

    const leafCount = Math.max(nextSlot, 1);
    const treeWidth = leafCount * X_GAP;

    // category root sits centered above its tree, one level up
    positions.set(category.id, {
      id: category.id,
      x: cursorX + treeWidth / 2 - X_GAP / 2,
      y: 0,
    });

    for (const t of techs) {
      const s = slot.get(t.id) ?? 0;
      const d = depth.get(t.id) ?? 1;
      positions.set(t.id, {
        id: t.id,
        x: cursorX + s * X_GAP,
        y: d * Y_GAP,
      });
    }

    categoryWidths.set(category.id, treeWidth);
    cursorX += treeWidth + CATEGORY_GAP_X;
  }

  return { positions, categoryWidths };
}
