export function getArchetype(ai: number, coding: number, career: number): string {
  const max = Math.max(ai, coding, career);
  const min = Math.min(ai, coding, career);

  if (max - min <= 10) return "BALANCED MENACE";
  if (max === ai) return "PROMPT WIZARD";
  if (max === coding) return "BUG SLAYER";
  return "INTERVIEW MENACE";
}