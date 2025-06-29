// src/statechart.ts
import { Instrument } from './instrument.js';

export interface Transition { event: string; to: string; }

export class Statechart {
  #state: string;
  constructor(
    start: string,
    private readonly graph: Map<string, Transition[]>,
    private readonly instr: Instrument
  ) { this.#state = start; }

  event(e: string) {
    const trans = this.graph.get(this.#state)?.find(t => t.event === e);
    if (trans) {
      this.instr.trace('statechart.transition', { from: this.#state, to: trans.to, event: e });
      this.#state = trans.to;
    }
  }
  get state() { return this.#state; }
}
