import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";

type Props = {
  graph: {
    nodes: any[];
    edges: any[];
  };
  selectedNodeId?: string | null;
  onNodeSelect: (node: any) => void;
};

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;

// Helper for type-based colors (Matching our CORTEX palette)
const getTypeStyles = (type: string, isSelected: boolean) => {
  const themes: Record<string, string> = {
    idea: "bg-blue-50 border-blue-200 text-blue-700",
    assumption: "bg-amber-50 border-amber-200 text-amber-700",
    conflict: "bg-red-50 border-red-200 text-red-700",
    default: "bg-gray-50 border-gray-200 text-gray-700",
  };
  return themes[type] || themes.default;
};

export default function ThoughtGraph({
  graph,
  selectedNodeId,
  onNodeSelect,
}: Props) {
  
  // 1. Connection logic (unchanged but critical for focus)
  const connectedIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const ids = new Set<string>([selectedNodeId]);
    graph.edges.forEach((e: any) => {
      if (e.from === selectedNodeId) ids.add(e.to);
      if (e.to === selectedNodeId) ids.add(e.from);
    });
    return ids;
  }, [selectedNodeId, graph.edges]);

  // 2. Dagre Layout (LR = Left to Right flow)
  const dagreGraph = useMemo(() => {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: "LR", ranksep: 80, nodesep: 40 });

    graph.nodes.forEach((n: any) => {
      g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    graph.edges.forEach((e: any) => {
      g.setEdge(e.from, e.to);
    });

    dagre.layout(g);
    return g;
  }, [graph.nodes, graph.edges]);

  // 3. Nodes Styling
  const nodes: Node[] = useMemo(() =>
    graph.nodes.map((n: any) => {
      const { x, y } = dagreGraph.node(n.id);
      const isSelected = n.id === selectedNodeId;
      const isDimmed = selectedNodeId && !connectedIds.has(n.id);

      return {
        id: n.id,
        data: { label: n.label, raw: n },
        position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
        className: `
          transition-all duration-500 rounded-xl px-4 py-3 border shadow-sm
          ${getTypeStyles(n.type, isSelected)}
          ${isSelected ? "ring-2 ring-black border-transparent scale-105 z-50" : ""}
          ${isDimmed ? "opacity-20 grayscale" : "opacity-100"}
        `,
        style: {
          width: NODE_WIDTH,
          fontSize: '11px',
          fontWeight: 600,
          textAlign: 'center' as const,
        },
      };
    }),
  [graph.nodes, dagreGraph, connectedIds, selectedNodeId]
  );

  // 4. Edges Styling
  const edges: Edge[] = useMemo(() =>
    graph.edges.map((e: any) => {
      const isRelevant = !selectedNodeId || e.from === selectedNodeId || e.to === selectedNodeId;
      
      return {
        id: `${e.from}-${e.to}`,
        source: e.from,
        target: e.to,
        label: e.relation,
        animated: isRelevant,
        labelStyle: { fontSize: 9, fill: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' },
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.8 },
        style: {
          stroke: isRelevant ? '#cbd5e1' : '#f1f5f9',
          strokeWidth: isRelevant ? 1.5 : 1,
          opacity: isRelevant ? 1 : 0.1,
        },
      };
    }),
  [graph.edges, selectedNodeId]
  );

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    onNodeSelect(node.data.raw);
  };

  return (
    <div className="relative h-[480px] w-full bg-white rounded-3xl border border-gray-100 shadow-inner overflow-hidden group">
      {/* Visual Overlay Labels */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">
          Logic Mapping / {graph.nodes.length} Nodes
        </span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        fitView
        nodesDraggable={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        preventScrolling={true}
      >
        <Background color="#f1f5f9" variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls className="bg-white border-gray-200 shadow-xl" />
      </ReactFlow>

      {/* Decorative frame for "Blueprint" feel */}
      <div className="absolute inset-0 border-[12px] border-white pointer-events-none rounded-3xl" />
    </div>
  );
}

// Ensure you import BackgroundVariant
import { BackgroundVariant } from "reactflow";