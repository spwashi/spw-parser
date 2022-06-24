import {ALL_GENERATORS} from "./constructs/index.mjs";
import {Cursor}         from "./cursor.mjs";

export function* loopGenerators(cursor, generators = ALL_GENERATORS) {
  let prev;
  while (cursor.curr()) {
    let token = false;
    for (let generator of generators) {
      token = yield* generator(cursor, token);
    }

    yield token;
    if (token === false) return {prev};

    // track history
    prev   = token;
    cursor = new Cursor({i: cursor.i, prev: cursor})
  }
}