// src/index.ts
import { createContext } from './context.js';
import { Scheduler } from './scheduler.js';
import { Fiber } from './fiber.js';
import { createLoggerFiber } from './logger.js';
import { Channel } from './channel.js';
import { NullInstrument } from './instrument.js';

// Boot sequence for a tiny “hello runtime” test
const instr = NullInstrument;                    // plug in Datadog etc.
const ctx = createContext(instr);
const sched = new Scheduler(instr);

// Example: user log channel and fiber
const logChan = new Channel<string>('log', 0, instr);
ctx.channels.set('log', logChan);
sched.spawn(createLoggerFiber('logger', logChan, instr));

// Example worker fiber
sched.spawn(
  new Fiber('worker', function* () {
    logChan.send('[boot] worker online');
    yield* sleepMs(250);
    logChan.send('[done] worker exiting');
  }, instr)
);

// Start the show
import { sleepMs } from './timer.js';
sched.run();
