import type { TensionNode, TensionEdge } from "~/lib/tensionGraph";

export type TensionCluster = {
  id: string;
  nodes: string[];
  strength: number;
};

export function buildClusters(
  nodes: TensionNode[],
  edges: TensionEdge[],
  threshold = 2
): TensionCluster[] {
  const clusters: TensionCluster[] = [];
  const used = new Set<string>();

  for (const e of edges) {
    if (e.weight < threshold) continue;

    const key = [e.source, e.target].sort().join("::");
    if (used.has(key)) continue;

    clusters.push({
      id: key,
      nodes: [e.source, e.target],
      strength: e.weight,
    });

    used.add(key);
  }

  return clusters;
}
