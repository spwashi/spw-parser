// src/context.ts
import { Instrument } from './instrument.js';

export interface ExecutionContext {
  readonly instrument: Instrument;
  constants: Map<string, unknown>;
  channels: Map<string, Channel<unknown>>;
  types: Map<string, unknown>;           // place-holder for type metadata
}

import type { Channel } from './channel.js';

export function createContext(
  instrument: Instrument
): ExecutionContext {
  return {
    instrument,
    constants: new Map(),
    channels:  new Map(),
    types:     new Map(),
  };
}
