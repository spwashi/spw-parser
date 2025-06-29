// src/channel.ts
import { Instrument } from './instrument.js';

export class Channel<T> {
  #buffer: T[] = [];
  constructor(
    public readonly name: string,
    private readonly size = 0,
    private readonly instr: Instrument = { trace(){}, count(){} }
  ) {}

  send(value: T): void {
    if (this.size && this.#buffer.length >= this.size) {
      throw new Error(`Channel ${this.name} is full`);
    }
    this.#buffer.push(value);
    this.instr.count(`channel.${this.name}.send`);
    this.instr.trace('chan.send', { name: this.name, value });
  }

  *receive(): Generator<T, T, void> {
    while (this.#buffer.length === 0) {
      yield;                     // cooperate with scheduler
    }
    this.instr.count(`channel.${this.name}.recv`);
    const v = this.#buffer.shift() as T;
    this.instr.trace('chan.recv', { name: this.name, value: v });
    return v;
  }
}
