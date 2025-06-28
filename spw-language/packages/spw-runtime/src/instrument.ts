// src/instrument.ts
export interface Instrument {
  trace(event: string, data?: Record<string, unknown>): void;
  count(metric: string, delta?: number): void;
}

export const NullInstrument: Instrument = {
  trace: () => {},
  count: () => {},
};
