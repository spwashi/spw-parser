// src/scheduler.ts
import { Fiber } from './fiber.js';
import { Instrument } from './instrument.js';

export class Scheduler {
  #queue: Fiber[] = [];

  constructor(private readonly instr: Instrument = { trace(){}, count(){} }) {}

  spawn(f: Fiber) {
    this.#queue.push(f);
    this.instr.trace('sched.spawn', { fiber: f.name });
  }

  run(): void {
    while (this.#queue.length) {
      const f = this.#queue.shift()!;
      const alive = f.step();
      if (alive && f.state !== 4) { // not DONE/ERROR
        this.#queue.push(f);
      }
    }
  }
}
