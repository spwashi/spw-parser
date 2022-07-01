import {ALL_GENERATORS} from "./constructs/index.mjs";
import {_debug}         from "./constants.mjs";

export function* loopGenerators(cursor, generators = ALL_GENERATORS) {
  let prev;
  _debug && (yield '--looping--');
  for (let generator of generators) {
    const token = yield* generator(cursor, prev ?? false);
    if (token === false) continue;
    if (token !== prev) {
      yield token
    }
    prev = token;
  }
  _debug && (yield '--looped--');
}