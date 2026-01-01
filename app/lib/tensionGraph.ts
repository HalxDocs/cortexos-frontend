import type { CortexSession } from "~/lib/memory";

export type TensionNode = {
  id: string;
  label: string;
  count: number;
  lastSeen: number; // timestamp
};

export type TensionEdge = {
  id: string;
  source: string;
  target: string;
  weight: number; // how often this transition happens
};

/**
 * Build tension nodes
 * - One node per unique core tension
 * - count = frequency
 * - lastSeen = recency
 */
export function buildTensionNodes(
  sessions: CortexSession[]
): TensionNode[] {
  const map = new Map<string, TensionNode>();

  for (const s of sessions) {
    const key = s.coreTension;
    if (!key) continue;

    const ts = new Date(s.createdAt).getTime();

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        label: key,
        count: 1,
        lastSeen: ts,
      });
    } else {
      const n = map.get(key)!;
      n.count += 1;
      n.lastSeen = Math.max(n.lastSeen, ts);
    }
  }

  return Array.from(map.values());
}

/**
 * Build drift edges (WEIGHTED)
 * - Aggregates repeated transitions
 * - weight = oscillation strength
 */
export function buildTensionEdges(
  sessions: CortexSession[]
): TensionEdge[] {
  if (sessions.length < 2) return [];

  const sorted = [...sessions].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  );

  const map = new Map<string, TensionEdge>();

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].coreTension;
    const curr = sorted[i].coreTension;

    if (!prev || !curr) continue;
    if (prev === curr) continue;

    const key = `${prev}->${curr}`;

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        source: prev,
        target: curr,
        weight: 1,
      });
    } else {
      map.get(key)!.weight += 1;
    }
  }

  return Array.from(map.values());
}
