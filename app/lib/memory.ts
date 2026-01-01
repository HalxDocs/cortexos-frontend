const STORAGE_KEY = "cortex_sessions";

export type CortexSession = {
  id: string;
  createdAt: string;
  coreTension: string;
  confidence: number;
  reflection: string;
};

/**
 * Saves a session to the top of the stack.
 */
export function saveSession(data: any) {
  if (typeof window === "undefined") return;

  const sessions = getSessions();

  const newSession: CortexSession = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    coreTension: data.reflection?.core_tension || "Unresolved Tension",
    confidence:
      typeof data.confidence?.analysis_confidence === "number"
        ? data.confidence.analysis_confidence
        : 0.5,
    reflection: data.reflection?.summary || "No summary provided.",
  };

  // We place newSession FIRST in the array.
  // This ensures index 0 is always the most recent.
  const updatedSessions = [newSession, ...sessions];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
  
  // Return the new session in case the caller needs the generated ID
  return newSession;
}

/**
 * Retrieves sessions. Since we save new ones at the front, 
 * this naturally returns them in reverse-chronological order.
 */
export function getSessions(): CortexSession[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    // Extra safety: ensure it's an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("CORTEX_MEMORY_CORRUPTION:", err);
    return [];
  }
}

/**
 * Utility to clear archive if needed
 */
export function clearArchive() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}