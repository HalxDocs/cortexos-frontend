import type { CortexSession } from "~/lib/memory";

export function filterSessionsByTime(
  sessions: CortexSession[],
  until: number
) {
  return sessions.filter(
    (s) => new Date(s.createdAt).getTime() <= until
  );
}
