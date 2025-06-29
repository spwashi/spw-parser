// src/units.ts
export function convert(value: number, from: string, to: string): number {
  if (from === to) return value;
  throw new Error(`unit conversion ${from}→${to} not implemented`);
}
