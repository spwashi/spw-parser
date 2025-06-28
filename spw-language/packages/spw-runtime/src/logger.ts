// src/logger.ts
import { Channel } from './channel.js';
import { Instrument } from './instrument.js';
import { Fiber } from './fiber.js';

export function createLoggerFiber(
  name: string,
  chan: Channel<string>,
  instr: Instrument
): Fiber {
  function* run() {
    while (true) {
      const line: string = yield* chan.receive();
      console.log(line);
      instr.trace('logger.out', { line });
    }
  }
  return new Fiber(name, run, instr);
}
