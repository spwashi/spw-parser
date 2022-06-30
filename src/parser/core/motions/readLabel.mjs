import {nominal}   from "../constructs/nodes/nominal/nominal.mjs";
import {numeric}   from "../constructs/nodes/numeric/numeric.mjs";
import {container} from "../constructs/nodes/container/container.mjs";

export function* readLabel(cursor) {
  let label = false;
  if (cursor.curr() === '_') {
    cursor.advance();
    for (let generator of [nominal, numeric, container]) {
      label = yield* generator(cursor, label);
    }
  }
  return label;
}