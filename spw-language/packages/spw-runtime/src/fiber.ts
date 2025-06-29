// src/fiber.ts
import { Instrument } from './instrument.js';

export type FiberGen = Generator<unknown, unknown, unknown>;

export enum FiberState { NEW, RUNNING, SUSPENDED, DONE, ERROR }

export class Fiber {
  state = FiberState.NEW;
  error: unknown = null;

  constructor(
    public readonly name: string,
    private readonly genFactory: () => FiberGen,
    private readonly instr: Instrument = { trace(){}, count(){} }
  ) {}

  #gen: FiberGen | null = null;

  /** step the fiber once; returns true if still runnable */
  step(): boolean {
    if (this.state === FiberState.NEW) {
      this.#gen = this.genFactory();
      this.state = FiberState.RUNNING;
      this.instr.trace('fiber.start', { name: this.name });
    }
    if (!this.#gen) return false;

    try {
      const res = this.#gen.next();
      if (res.done) {
        this.state = FiberState.DONE;
        this.instr.trace('fiber.done', { name: this.name });
        return false;
      }
      this.state = FiberState.SUSPENDED;
      return true;
    } catch (e) {
      this.state = FiberState.ERROR;
      this.error = e;
      this.instr.trace('fiber.error', { name: this.name, error: String(e) });
      return false;
    }
  }
}
