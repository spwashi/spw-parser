// src/cognitive.ts
export function fittsLaw(distance: number, width: number): number {
  return Math.log2(distance / width + 1);  // ID, not duration
}
