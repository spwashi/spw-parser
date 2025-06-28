// src/error.ts
import { Instrument } from './instrument.js';

export function* tryCatch<T>(
  tryBlock: () => Generator<unknown, T, unknown>,
  catchBlock: (e: unknown) => Generator
): Generator<unknown, T, unknown> {
  try {
    return yield* tryBlock();
  } catch (e) {
    yield* catchBlock(e);
    throw e;
  }
}
