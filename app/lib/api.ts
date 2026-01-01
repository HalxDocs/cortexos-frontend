export async function analyzeThought(text: string) {
  const res = await fetch("http://localhost:8080/v1/analyze-thought", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Request failed");
  }

  return res.json();
}
