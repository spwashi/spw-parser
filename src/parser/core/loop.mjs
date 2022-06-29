import {ALL_GENERATORS} from "./constructs/index.mjs";
import {Cursor}         from "./cursor.mjs";
import {_debug}         from "./constants.mjs";

export function* loopGenerators(cursor, generators = ALL_GENERATORS) {
  let prev;
  while (cursor.curr()) {
    let token = false;
    _debug && (yield '--looping--');
    for (let generator of generators) {
      token = yield* generator(cursor, token);
    }
    _debug && (yield '--looped--');
    yield token;
    if (token === false) return {prev};
    // track history
    prev   = token;
    cursor = new Cursor(cursor)
  }
}