import type { CortexSession } from "~/lib/memory";

export function detectCoreTensionPattern(
  sessions: CortexSession[]
): string | null {
  if (sessions.length < 3) return null;

  const counts: Record<string, number> = {};

  for (const s of sessions) {
    if (!s.coreTension) continue;
    counts[s.coreTension] = (counts[s.coreTension] || 0) + 1;
  }

  let topTension: string | null = null;
  let maxCount = 0;

  for (const [tension, count] of Object.entries(counts)) {
    if (count > maxCount && count >= 2) {
      topTension = tension;
      maxCount = count;
    }
  }

  return topTension;
}
