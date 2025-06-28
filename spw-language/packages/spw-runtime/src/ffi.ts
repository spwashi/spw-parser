// src/ffi.ts
import { Instrument } from './instrument.js';

export type FfiFn = (...args: unknown[]) => unknown;

export class Ffi {
  #symbols = new Map<string, FfiFn>();
  constructor(private readonly instr: Instrument) {}

  register(name: string, fn: FfiFn) {
    this.#symbols.set(name, fn);
    this.instr.trace('ffi.register', { name });
  }
  invoke<T>(name: string, ...args: unknown[]): T {
    const fn = this.#symbols.get(name);
    if (!fn) throw new Error(`ffi symbol ${name} missing`);
    this.instr.count(`ffi.${name}.calls`);
    return fn(...args) as T;
  }
}
