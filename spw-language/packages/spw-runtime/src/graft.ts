// src/graft.ts
import { Instrument } from './instrument.js';
import { Fiber } from './fiber.js';

export interface Patch {
  targetFlow: string;
  newFactory: () => Generator;
}

export class GraftManager {
  #patches: Patch[] = [];
  constructor(private readonly instr: Instrument) {}

  queue(patch: Patch) {
    this.#patches.push(patch);
    this.instr.trace('graft.patchQueued', { target: patch.targetFlow });
  }
  apply(fibers: Map<string, Fiber>) {
    for (const p of this.#patches.splice(0)) {
      const fiber = fibers.get(p.targetFlow);
      if (fiber) {
        fibers.set(
          p.targetFlow,
          new Fiber(p.targetFlow, p.newFactory, this.instr)
        );
        this.instr.trace('graft.applied', { target: p.targetFlow });
      }
    }
  }
}
