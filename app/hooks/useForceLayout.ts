import { useEffect } from "react";
import { forceSimulation, forceManyBody, forceCenter, forceLink } from "d3-force";
import type { Node, Edge } from "reactflow";

export function useForceLayout(
  nodes: Node[],
  edges: Edge[],
  setNodes: (n: Node[]) => void
) {
  useEffect(() => {
    if (nodes.length === 0) return;

    const sim = forceSimulation(nodes as any)
      .force("charge", forceManyBody().strength(-300))
      .force("center", forceCenter(0, 0))
      .force(
        "link",
        forceLink(edges as any)
          .id((d: any) => d.id)
          .distance(140)
          .strength(0.6)
      )
      .on("tick", () => {
        setNodes([...nodes]);
      });

    return () => {
      sim.stop();
    };
  }, []);
}
