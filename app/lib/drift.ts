import type { CortexSession } from "~/lib/memory";

function mode(values: string[]): string | null {
  if (values.length === 0) return null;

  const counts: Record<string, number> = {};
  for (const v of values) counts[v] = (counts[v] || 0) + 1;

  let top: string | null = null;
  let max = 0;

  for (const [k, c] of Object.entries(counts)) {
    if (c > max) {
      max = c;
      top = k;
    }
  }

  // require a clear signal
  return max >= 2 ? top : null;
}

export function detectPatternDrift(
  sessions: CortexSession[]
): {
  status: "consistent" | "shifted";
  earlier?: string;
  recent?: string;
} | null {
  if (sessions.length < 5) return null;

  const sorted = [...sessions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const windowSize = Math.floor(sorted.length * 0.4);
  if (windowSize < 2) return null;

  const early = sorted.slice(0, windowSize).map(s => s.coreTension);
  const recent = sorted.slice(-windowSize).map(s => s.coreTension);

  const earlyMode = mode(early);
  const recentMode = mode(recent);

  if (!earlyMode || !recentMode) return null;

  if (earlyMode === recentMode) {
    return { status: "consistent", earlier: earlyMode };
  }

  return {
    status: "shifted",
    earlier: earlyMode,
    recent: recentMode,
  };
}
