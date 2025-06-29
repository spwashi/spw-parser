// src/timer.ts
export function* sleepMs(ms: number): Generator<void, void, void> {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    yield;      // cooperative wait
  }
}
