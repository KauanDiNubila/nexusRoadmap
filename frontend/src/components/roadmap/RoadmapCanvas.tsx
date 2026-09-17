import { useMemo } from "react";
import ReactFlow, { Background, BackgroundVariant, Controls, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import { useRoadmap } from "@/hooks/useRoadmap";
import { layoutRoadmap } from "@/lib/layout";
import { accentOf } from "@/lib/accent";
import { TechNode, type TechNodeData } from "@/components/nodes/TechNode";
import { CategoryNode, type CategoryNodeData } from "@/components/nodes/CategoryNode";
import { SkillEdge, type SkillEdgeData } from "@/components/edges/SkillEdge";
import { RelationEdge } from "@/components/edges/RelationEdge";

const { positions } = layoutRoadmap();

const nodeTypes = { category: CategoryNode, tech: TechNode };
const edgeTypes = { skill: SkillEdge, relation: RelationEdge };

export function RoadmapCanvas() {
  const { categories, techs, techsById, crossLinks, getTechStatus, selectTech } = useRoadmap();

  const nodes = useMemo<Node[]>(() => {
    const categoryNodes: Node<CategoryNodeData>[] = categories.map((c) => ({
      id: c.id,
      type: "category",
      position: positions.get(c.id) ?? { x: 0, y: 0 },
      data: { categoryId: c.id },
      draggable: false,
      selectable: false,
    }));

    const techNodes: Node<TechNodeData>[] = techs.map((t) => ({
      id: t.id,
      type: "tech",
      position: positions.get(t.id) ?? { x: 0, y: 0 },
      data: { techId: t.id },
      draggable: false,
    }));

    return [...categoryNodes, ...techNodes];
  }, [categories, techs]);

  const edges = useMemo<Edge[]>(() => {
    const list: Edge<SkillEdgeData>[] = [];

    for (const category of categories) {
      const accent = accentOf(category.accent);
      const roots = techs.filter((t) => t.categoryId === category.id && t.parentId === null);
      for (const root of roots) {
        list.push({
          id: `e-${category.id}-${root.id}`,
          source: category.id,
          target: root.id,
          type: "skill",
          data: { accentMain: accent.main, targetStatus: getTechStatus(root.id) },
        });
      }
    }

    for (const tech of techs) {
      if (!tech.parentId) continue;
      const category = categories.find((c) => c.id === tech.categoryId);
      const accent = accentOf(category?.accent ?? "cyan");
      list.push({
        id: `e-${tech.parentId}-${tech.id}`,
        source: tech.parentId,
        target: tech.id,
        type: "skill",
        data: { accentMain: accent.main, targetStatus: getTechStatus(tech.id) },
      });
    }

    const relations: Edge[] = crossLinks.map((link) => ({
      id: `x-${link.from}-${link.to}`,
      source: link.from,
      target: link.to,
      type: "relation",
    }));

    return [...list, ...relations];
  }, [categories, techs, crossLinks, getTechStatus, techsById]);

  return (
    <div className="h-full w-full" style={{ background: "var(--color-void)" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.28, maxZoom: 0.95 }}
        minZoom={0.22}
        maxZoom={1.4}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        proOptions={{ hideAttribution: true }}
        onPaneClick={() => selectTech(null)}
      >
        <Background variant={BackgroundVariant.Dots} gap={30} size={1} color="rgba(255,255,255,0.055)" />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>
    </div>
  );
}
